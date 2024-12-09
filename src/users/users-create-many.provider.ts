import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateManyUsersDto } from './dto/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    //injecting usersRepository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    //inject DataSource
    private readonly dataSource: DataSource,
  ) {}
  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    let newUsers: User[] = [];

    //Create Query RUnner Instance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      //Connect Query Runner to datasource
      await queryRunner.connect();

      //Start Transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException('Could not connect to database');
    }

    try {
      //If successful commit
      for (let user of createManyUsersDto.users) {
        let newUser = queryRunner.manager.create(User, user);
        let result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      //If unsuccessful rollback
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      try {
        //Release connection
        await queryRunner.release();
      } catch (error) {
        throw (
          (new ConflictException('Could not connect to the database'),
          {
            description: String(error),
          })
        );
      }
    }

    return newUsers;
  }
}
