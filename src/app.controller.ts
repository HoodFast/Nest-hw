import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersSqlQueryRepository } from './users/infrastructure/users.sql.query.repository';
import { UsersSqlRepository } from './users/infrastructure/users.sql.repository';
import { UsersRepository } from './users/infrastructure/users.repository';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    protected userSqlQueryRepository: UsersSqlQueryRepository,
    protected userSqlRepository: UsersSqlRepository,
    protected userRepository: UsersRepository,
  ) {}

  @Get('getUser/:id')
  async getHello(@Param('id') id: string) {
    const res = await this.userSqlQueryRepository.getMe(id);
    debugger;
    return res;
  }
  @Get('try')
  async getTestingManual(@Query() input: { loginOrEmail: string }) {
    return await this.userSqlRepository.updateNewConfirmCode(
      input.loginOrEmail,
      '123123123',
    );
  }
}
