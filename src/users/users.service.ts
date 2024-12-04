import { Body, ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    //injecting usersRepository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (isNotEmpty(existingUser)) {
      throw new ConflictException();
    }

    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);

    return newUser;
  }

  public async findOneById(id: number) {
    return await this.usersRepository.findOneBy({ id });
  }
}
