import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../domain/user.schema';
import { OutputUsersType } from '../api/output/users.output.dto';
import { randomUUID } from 'crypto';
import { Users } from '../domain/user.sql.entity';

@Injectable()
export class UsersSqlRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async getAll(): Promise<any> {
    const result = await this.dataSource.query(`
    SELECT id, "login"
        FROM public."users";`);
    return result;
  }
  async createUser(userData: User): Promise<OutputUsersType | null> {
    const { accountData, emailConfirmation } = userData;
    const userId = randomUUID();
    const emailId = randomUUID();

    try {
      const query = `
        INSERT INTO public."users"(
        "id", "_passwordHash", "login", "email", "createdAt")
        VALUES ($1, $2, $3, $4, $5);
    `;

      const insertUserTable = await this.dataSource.query(query, [
        userId,
        accountData._passwordHash,
        accountData.login,
        accountData.email,
        accountData.createdAt,
      ]);
      const queryEmail = `
        INSERT INTO public."emailConfirmation"(
        "id", "confirmationCode", "expirationDate", "isConfirmed", "userId")
        VALUES ($1, $2, $3, $4, $5);
    `;
      const insertEmailTable = await this.dataSource.query(queryEmail, [
        emailId,
        emailConfirmation.confirmationCode,
        emailConfirmation.expirationDate,
        emailConfirmation.isConfirmed,
        userId,
      ]);
      a;
    } catch (e) {
      console.log(e);
      return e;
    }
    const result = await this.dataSource.query(
      `
        SELECT "id", "_passwordHash", "login", "email", "createdAt"
        FROM public."users" as u
        WHERE u."id" = $1
    `,
      [userId],
    );

    return {
      id: result[0].id,
      login: result[0].login,
      email: result[0].email,
      createdAt: result[0].createdAt,
    };
  }

  async blackListCheck(userId: string, token: string): Promise<boolean> {
    const res = await this.dataSource.query(
      `
        SELECT  ARRAY_AGG(token)
            FROM public."tokensBlackList" t
            WHERE t."userId" = $1`,
      [userId],
    );
    if (!res) return false;

    const blackList = res[0].array_agg;
    const check = blackList?.includes(token);

    return !!check;
  }
  async doesExistByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<boolean> {
    const existCheck = await this.dataSource.query(
      `
    SELECT id
        FROM public."users" u
        WHERE u."login" = $1 OR u."email" = $2
    `,
      [login, email],
    );
    return !!existCheck[0];
  }
  async confirmEmail(userId: string) {
    try {
      await this.dataSource.query(
        `
        UPDATE public."emailConfirmation" e
            SET  "isConfirmed"=true
            WHERE e."userId" = $1;
    `,
        [userId],
      );
      return true;
    } catch (e) {
      return false;
    }
  }
  async deleteUser(userId: string) {
    const deleted = await this.dataSource.query(
      `
    DELETE FROM public."users" u
    WHERE u."id" = $1
    `,
      [userId],
    );
    return !!deleted[1];
  }
  async changePass(userId: string, hash: string): Promise<boolean> {
    const res = await this.dataSource.query(
      `
        UPDATE public."users" u
            SET  "_passwordHash"= $2
            WHERE u."id" = $1;
    `,
      [userId, hash],
    );
    return !!res[1];
  }
  async updateNewConfirmCode(userId: string, code: string): Promise<boolean> {
    const res = await this.dataSource.query(
      `
        UPDATE public."emailConfirmation" e
            SET  "confirmationCode"= $2
            WHERE e."userId" = $1;
    `,
      [userId, code],
    );
    return !!res[1];
  }
}
