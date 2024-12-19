import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserProvider } from './create-user.provider';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const mockCreateUserProvider: Partial<CreateUserProvider> = {
      createUser: (createUserDto: CreateUserDto) =>
        Promise.resolve({
          id: 12,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          password: createUserDto.password,
        }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,

        { provide: CreateUserProvider, useValue: mockCreateUserProvider },

        //add use repository dependency in the 2 lines below
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },

        { provide: CreateGoogleUserProvider, useValue: {} },
        { provide: UsersCreateManyProvider, useValue: {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should be defined', () => {
      expect(service.createUser).toBeDefined();
    });
    it('should call createUser on CreateUserProvider', async () => {
      const user = await service.createUser({
        firstName: 'Cazu',
        lastName: 'Guara',
        email: 'Cazu@Guara@gmail.com',
        password: 'lecaZu',
      });
      expect(user.firstName).toEqual('Cazu');
    });
  });
});
