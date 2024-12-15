import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Headers,
  Ip,
  ParseIntPipe,
  DefaultValuePipe,
  ValidationPipe,
  Patch,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersParamDto } from './dto/get-users-param.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateManyUsersDto } from './dto/create-many-users.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'the number of entries returned per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'the position of the page number you want to return',
    example: 1,
  })
  @ApiOperation({
    summary: 'fetches list of users by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully based on the request',
  })
  //getUsersById(@Param() params: any, @Query() query: any) {
  getUsersById(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number | undefined,
    @Query('page', ParseIntPipe, new DefaultValuePipe(1))
    page: number | undefined,
    @Headers() headers: any,
    @Ip() ip: string,
  ) {
    console.log(getUsersParamDto);
    console.log(limit);
    console.log(page);
    console.log(headers);
    console.log(ip);
    return this.usersService.findOneById(getUsersParamDto.id);
  }

  @Post()
  //@SetMetadata('authType', 'none')
  @Auth(AuthType.Bearer)
  createUsers(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.createUser(createUserDto);
  }

  //@UseGuards(AccessTokenGuard)
  @Post('create-many')
  createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    console.log(createManyUsersDto);
    return this.usersService.createMany(createManyUsersDto);
  }

  @Patch()
  patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
