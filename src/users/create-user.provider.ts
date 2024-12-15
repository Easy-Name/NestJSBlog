import {
  Body,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    //injecting usersRepository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    //inject hashinProvider
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    let existingUser = undefined;

    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, pelase try later',
        { description: 'Error connecting to the database' },
      );
    }

    if (isNotEmpty(existingUser)) {
      throw new ConflictException('email already in use');
    }

    try {
      let newUser = this.usersRepository.create({
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });
      newUser = await this.usersRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, pelase try later',
        { description: 'Error connecting to the database' },
      );
    }
  }
}
