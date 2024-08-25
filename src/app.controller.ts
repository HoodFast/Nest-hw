import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersSqlQueryRepository } from './users/infrastructure/users.sql.query.repository';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    protected userSqlQueryRepository: UsersSqlQueryRepository,
  ) {}

  @Get()
  async getHello() {
    return await this.appService.getHello();
  }
  @Get('try')
  async getTestingManual(@Query() input: { loginOrEmail: string }) {
    return await this.userSqlQueryRepository.findUser(input.loginOrEmail);
  }
}
