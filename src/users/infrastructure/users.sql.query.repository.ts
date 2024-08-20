import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersSqlQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getAll(): Promise<any> {
    const result = await this.dataSource.query(`
    SELECT id, "Login"
        FROM public."Users";`);
    return result;
  }
}
