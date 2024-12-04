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
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersParamDto } from './dto/get-users-param.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getUsers() {
    return 'I am getting all users';
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
    return 'I am getting users by ID';
  }

  @Post()
  createUsers(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
