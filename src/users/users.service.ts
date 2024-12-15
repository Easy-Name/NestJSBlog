import {
  Body,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { isEmpty, isNotEmpty } from 'class-validator';
import { GetUsersParamDto } from './dto/get-users-param.dto';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from './dto/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { GoogleUser } from './interfaces/google-user.interface';

@Injectable()
export class UsersService {
  constructor(
    //injecting usersRepository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    //inject DataSource
    private readonly usersCreateManyProvider: UsersCreateManyProvider,
    private readonly createUserProvider: CreateUserProvider,
    private readonly createGoogleUserProvider: CreateGoogleUserProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.createUserProvider.createUser(createUserDto);
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
  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }

  public async findOneByEmail(email: string): Promise<User | undefined> {
    let user: User | undefined = undefined;

    try {
      user = await this.usersRepository.findOneBy({ email: email });
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

  public async findOneByGoogleId(googleId: string): Promise<User | undefined> {
    let user: User | undefined = undefined;

    try {
      user = await this.usersRepository.findOneBy({ googleId: googleId });
      //console.log(user);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, pelase try later',
        { description: 'Error connecting to the database' },
      );
    }
/*
    if (isEmpty(user)) {
      throw new NotFoundException('The user does not exist');
    }*/
    return user;
  }

  public async createGoogleUser(googleUser: GoogleUser){
    return await this.createGoogleUserProvider.createGoogleUser(googleUser);
  }
}
