import {
  Body,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { isEmpty, isNotEmpty } from 'class-validator';
import { GetUsersParamDto } from './dto/get-users-param.dto';

@Injectable()
export class UsersService {
  constructor(
    //injecting usersRepository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
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
      let newUser = this.usersRepository.create(createUserDto);
      newUser = await this.usersRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, pelase try later',
        { description: 'Error connecting to the database' },
      );
    }
  }

  public async findOneById(id: number) {
    let user = undefined;

    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, pelase try later',
        { description: 'Error connecting to the database' },
      );
    }

    if (isEmpty(user)) {
      throw new NotFoundException('The user does not exist');
    }
    return user;
  }

  public findAll /*getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,*/() {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endpoint does not exist',
        fileName: 'users.service.ts',
        lineNumber: 79,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: 'Occured because the API endpoint was permanently moved',
      },
    );
  }
}
