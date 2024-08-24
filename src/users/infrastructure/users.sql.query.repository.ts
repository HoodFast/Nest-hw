import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersSortData } from '../../base/sortData/sortData.model';
import { Pagination } from '../../base/paginationInputDto/paginationOutput';
import { OutputUsersType } from '../api/output/users.output.dto';

@Injectable()
export class UsersSqlQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getAll(): Promise<any> {
    const result = await this.dataSource.query(`
    SELECT id, "login"
        FROM public."Users";`);
    return result;
  }
  async getAllUsers(
    sortData: UsersSortData,
  ): Promise<Pagination<OutputUsersType>> {
    const {
      searchLoginTerm,
      searchEmailTerm,
      sortDirection,
      sortBy,
      pageSize,
      pageNumber,
    } = sortData;

    const offset = (pageNumber - 1) * pageSize;
    let res: any = [];
    try {
      res = await this.dataSource.query(
        `
    SELECT u."id", u."login", u."email" , u."createdAt" 
    FROM public."Users" u
    WHERE u."login" like $1 AND u."email" like $2
    ORDER BY u."${sortBy}" ${sortDirection}
    LIMIT $3 OFFSET $4
`,
        [
          '%' + searchLoginTerm + '%',
          '%' + searchEmailTerm + '%',
          pageSize,
          offset,
        ],
      );
    } catch (e) {}

    const totalCount = await this.dataSource.query(
      `
    SELECT COUNT("id")
    FROM public."Users" u
    WHERE u."login" like $1 OR u."email" like $2
`,
      ['%' + searchLoginTerm + '%', '%' + searchEmailTerm + '%'],
    );
    const pagesCount = Math.ceil(+totalCount[0].count / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount: +totalCount[0].count,
      items: res,
    };
  }
}
