import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersSqlQueryRepository } from './users/infrastructure/users.sql.query.repository';
import { UsersSqlRepository } from './users/infrastructure/users.sql.repository';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    protected userSqlQueryRepository: UsersSqlQueryRepository,
    protected userSqlRepository: UsersSqlRepository,
  ) {}

  @Get()
  async getHello() {
    return await this.appService.getHello();
  }
  @Get('try')
  async getTestingManual(@Query() input: { loginOrEmail: string }) {
    return await this.userSqlRepository.blackListCheck(
      input.loginOrEmail,
      'blablabla',
    );
  }
}
