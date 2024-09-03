import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersSortData } from '../../base/sortData/sortData.model';
import { Pagination } from '../../base/paginationInputDto/paginationOutput';
import { OutputUsersType } from '../api/output/users.output.dto';
import { userMapper } from '../domain/mapper/user.mapper.for.sql';
import { UserEntity } from '../domain/user.entity';
import { UserDocument } from '../domain/user.schema';
import { MyEntity } from '../../auth/api/output/me.entity';

@Injectable()
export class UsersSqlQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getAll(): Promise<any> {
    const result = await this.dataSource.query(`
    SELECT id, "login"
        FROM public."users";`);
    return result;
  }
  async findUser(loginOrEmail: string): Promise<UserEntity | null> {
    try {
      const res = await this.dataSource.query(
        `
    SELECT u."id",
      u."login",
      u."email",
      u."_passwordHash",
      u."recoveryCode",
      u."createdAt",
      e."expirationDate",
      e."isConfirmed",
      e."confirmationCode"
        FROM public."users" u
        LEFT JOIN public."emailConfirmation" e
        ON u."id" = e."userId"
        WHERE u."login" like $1 OR u."email" like $1
    `,
        [loginOrEmail],
      );

      const tokensBlackList = await this.dataSource.query(
        `
        SELECT  ARRAY_AGG(token)
            FROM public."tokensBlackList" t
            WHERE t."userId" = $1
`,
        [res[0].id],
      );
      if (!res) return null;

      return userMapper({ ...res[0], tokensBlackList });
    } catch (e) {
      console.log(e);
      return null;
    }
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
    FROM public."users" u
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
    FROM public."users" u
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
  async getUserById(id: string): Promise<UserEntity | null> {
    const res = await this.dataSource.query(
      `
    SELECT u."id",
      u."login",
      u."email",
      u."_passwordHash",
      u."recoveryCode",
      u."createdAt",
      e."expirationDate",
      e."isConfirmed",
      e."confirmationCode"
        FROM public."users" u
        LEFT JOIN public."emailConfirmation" e
        ON u."id" = e."userId"
        WHERE u."id" = $1
    `,
      [id],
    );
    const tokensBlackList = await this.dataSource.query(
      `
        SELECT  ARRAY_AGG(token)
            FROM public."tokensBlackList" t
            WHERE t."userId" = $1
`,
      [id],
    );

    if (!res[0]) return null;
    return userMapper({ ...res[0], tokensBlackList });
  }
  async getUserByCode(code: string): Promise<UserEntity | null> {
    debugger;
    const res = await this.dataSource.query(
      `
    SELECT u."id",
      u."login",
      u."email",
      u."_passwordHash",
      u."recoveryCode",
      u."createdAt",
      e."expirationDate",
      e."isConfirmed",
      e."confirmationCode"
        FROM public."users" u
        LEFT JOIN public."emailConfirmation" e
        ON u."id" = e."userId"
        WHERE e."confirmationCode" = $1
    `,
      [code],
    );
    if (!res[0]) return null;
    const tokensBlackList = await this.dataSource.query(
      `
        SELECT  ARRAY_AGG(token)
            FROM public."tokensBlackList" t
            WHERE t."userId" = $1
`,
      [res[0].id],
    );

    return userMapper({ ...res[0], tokensBlackList });
  }
  async getMe(userId: string): Promise<MyEntity | null> {
    const user = await this.dataSource.query(
      `
    SELECT u."id", u."login", u."email"
    FROM public."users" u
      WHERE u."id" = $1
    `,
      [userId],
    );

    if (!user[0]) return null;
    return {
      id: user.id,
      accountData: {
        login: user.login,
        email: user.email,
      },
    };
  }
}
