import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserInputDto } from './input/userInput.dto';
import { UsersService } from '../application/users.service';
import { UsersSortData } from '../../base/sortData/sortData.model';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';

@Controller('users')
export class UsersController {
  constructor(
    protected userService: UsersService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}
  @Get()
  async getAllUsers(@Query() input: UsersSortData) {
    const sortData: UsersSortData = {
      searchLoginTerm: input.searchLoginTerm ?? null,
      searchEmailTerm: input.searchEmailTerm ?? null,
      sortBy: input.sortBy ?? 'createdAt',
      sortDirection: input.sortDirection ?? 'desc',
      pageNumber: input.pageNumber ? input.pageNumber : 1,
      pageSize: input.pageSize ? input.pageSize : 10,
    };

    const users = this.usersQueryRepository.getAllUsers(sortData);
    return users;
  }
  @Post()
  async createUser(@Body() input: UserInputDto) {
    const { login, email, password } = input;

    const createdUser = await this.userService.createUser(
      login,
      email,
      password,
      true,
    );
    return createdUser;
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const deleteUser = this.userService.deleteUser(id);
    return deleteUser;
  }
}