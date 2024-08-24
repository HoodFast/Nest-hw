import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserInputDto } from './input/userInput.dto';
import { UsersService } from '../application/users.service';
import { UsersSortData } from '../../base/sortData/sortData.model';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';
import { Response } from 'express';
import { sortDirection } from '../../blogs/api/blogs.controller';
import { AuthGuard } from '../../guards/auth.guard';
import { OutputUsersType } from './output/users.output.dto';
import { Pagination } from '../../base/paginationInputDto/paginationOutput';
import { UsersSqlQueryRepository } from '../infrastructure/users.sql.query.repository';

// const validateOrRejectModel = async (model: any, ctor: { new (): any }) => {
//   if (!(model instanceof ctor)) {
//     throw new Error('incorrect input data');
//   }
//   try {
//     await validateOrReject(model);
//   } catch (e) {
//     throw new Error(e);
//   }
// };
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    protected userService: UsersService,
    protected usersQueryRepository: UsersQueryRepository,
    protected usersSqlQueryRepository: UsersSqlQueryRepository,
  ) {}
  @Get()
  async getAllUsers(
    @Query() input: UsersSortData,
  ): Promise<Pagination<OutputUsersType>> {
    const sortData: UsersSortData = {
      searchLoginTerm: input.searchLoginTerm ?? '',
      searchEmailTerm: input.searchEmailTerm ?? '',
      sortBy: input.sortBy ?? 'createdAt',
      sortDirection: input.sortDirection ?? sortDirection.asc,
      pageNumber: input.pageNumber ? +input.pageNumber : 1,
      pageSize: input.pageSize ? +input.pageSize : 10,
    };

    return await this.usersSqlQueryRepository.getAllUsers(sortData);
  }
  @UseGuards(AuthGuard)
  @Post()
  async createUser(
    @Body() input: UserInputDto,
  ): Promise<OutputUsersType | null> {
    // await validateOrRejectModel(input, UserInputDto);
    const { login, email, password } = input;
    const createdUser = await this.userService.createUser(
      login,
      email,
      password,
      true,
    );

    return createdUser;
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deleteUser = await this.userService.deleteUser(id);
    if (!deleteUser) return res.sendStatus(404);
    return res.sendStatus(204);
  }
}
