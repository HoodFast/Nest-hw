import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserInputDto } from './input/userInput.dto';
import { UsersService } from '../application/users.service';
import { UsersSortData } from '../../base/sortData/sortData.model';
import { UsersQueryRepository } from '../infrastructure/users.query.repository';
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
@Controller('sa/users')
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
      sortDirection: input.sortDirection ?? sortDirection.desc,
      pageNumber: input.pageNumber ? +input.pageNumber : 1,
      pageSize: input.pageSize ? +input.pageSize : 10,
    };
    const result = await this.usersSqlQueryRepository.getAllUsers(sortData);
    if (!result) throw new NotFoundException();
    return result;
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
  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const deleteUser = await this.userService.deleteUser(id);
    if (!deleteUser) throw new NotFoundException();
    return;
  }
}


Expected: {"pagesCount":1,"page":1,"pageSize":15,"totalCount":9,"items":[{"id":"0c0c8276-5149-41f1-87bd-c82b31b976d3","login":"loSer","email":"email2p@gg.om","createdAt":"2024-09-24T21:24:04.698Z"},{"id":"08891656-ed7d-4229-8f82-bd4d2ab5d0cc","login":"log01","email":"emai@gg.com","createdAt":"2024-09-24T21:24:03.698Z"},{"id":"59231b07-1c6c-4c76-8b7c-bc6176bf57db","login":"log02","email":"email2p@g.com","createdAt":"2024-09-24T21:24:04.202Z"},{"id":"8da2271d-f32b-4416-9bb7-d7dc2dcb4491","login":"uer15","email":"emarrr1@gg.com","createdAt":"2024-09-24T21:24:05.211Z"},{"id":"1d17694a-aab9-4ea8-99d8-ec4012166ff9","login":"user01","email":"email1p@gg.cm","createdAt":"2024-09-24T21:24:00.946Z"},{"id":"e0b8f881-24ed-49fa-adcb-7bb82994e353","login":"user02","email":"email1p@gg.com","createdAt":"2024-09-24T21:24:01.450Z"},{"id":"8eb1eda3-ea75-4b4b-8b13-94259e417906","login":"user03","email":"email1p@gg.cou","createdAt":"2024-09-24T21:24:02.598Z"},{"id":"6a8ab485-89eb-496a-b1f3-7ca95196dab5","login":"user05","email":"email1p@gg.coi","createdAt":"2024-09-24T21:24:02.010Z"},{"id":"8168e2dc-b1ed-4806-b995-015e0a029d1f","login":"usr-1-01","email":"email3@gg.com","createdAt":"2024-09-24T21:24:05.719Z"}]}

Received: {"pagesCount":1,"page":1,"pageSize":15,"totalCount":12,"items":[{"id":"0c0c8276-5149-41f1-87bd-c82b31b976d3","login":"loSer","email":"email2p@gg.om","createdAt":"2024-09-24T21:24:04.698Z"},{"id":"08891656-ed7d-4229-8f82-bd4d2ab5d0cc","login":"log01","email":"emai@gg.com","createdAt":"2024-09-24T21:24:03.698Z"},{"id":"59231b07-1c6c-4c76-8b7c-bc6176bf57db","login":"log02","email":"email2p@g.com","createdAt":"2024-09-24T21:24:04.202Z"},{"id":"2f2b7b70-b2b6-412e-bf2c-16f6dff68dab","login":"some01","email":"email1@gyyyg.ru","createdAt":"2024-09-24T21:24:06.214Z"},{"id":"8da2271d-f32b-4416-9bb7-d7dc2dcb4491","login":"uer15","email":"emarrr1@gg.com","createdAt":"2024-09-24T21:24:05.211Z"},{"id":"5b4ee1f6-2936-4b86-82da-d5e7873c6c16","login":"use4406","email":"email1@grrg.ro","createdAt":"2024-09-24T21:24:06.693Z"},{"id":"3fc68968-2a2a-463c-8908-5dec2dc4f8d9","login":"useee01","email":"email1p@gg.col","createdAt":"2024-09-24T21:24:03.178Z"},{"id":"1d17694a-aab9-4ea8-99d8-ec4012166ff9","login":"user01","email":"email1p@gg.cm","createdAt":"2024-09-24T21:24:00.946Z"},{"id":"e0b8f881-24ed-49fa-adcb-7bb82994e353","login":"user02","email":"email1p@gg.com","createdAt":"2024-09-24T21:24:01.450Z"},{"id":"8eb1eda3-ea75-4b4b-8b13-94259e417906","login":"user03","email":"email1p@gg.cou","createdAt":"2024-09-24T21:24:02.598Z"},{"id":"6a8ab485-89eb-496a-b1f3-7ca95196dab5","login":"user05","email":"email1p@gg.coi","createdAt":"2024-09-24T21:24:02.010Z"},{"id":"8168e2dc-b1ed-4806-b995-015e0a029d1f","login":"usr-1-01","email":"email3@gg.com","createdAt":"2024-09-24T21:24:05.719Z"}]}
