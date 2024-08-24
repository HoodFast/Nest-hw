import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '../domain/user.schema';
import { OutputUsersType } from '../api/output/users.output.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersSqlRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getAll(): Promise<any> {
    const result = await this.dataSource.query(`
    SELECT id, "login"
        FROM public."Users";`);
    return result;
  }
  async createUser(userData: User): Promise<OutputUsersType | null> {
    const { accountData, emailConfirmation } = userData;
    const userId = randomUUID();
    const emailId = randomUUID();

    try {
      const query = `
        INSERT INTO public."Users"(
        "id", "_passwordHash", "login", "email", "createdAt")
        VALUES ($1, $2, $3, $4, $5);
    `;
      debugger;
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
    } catch (e) {
      console.log(e);
      return e;
    }
    const result = await this.dataSource.query(
      `
        SELECT "id", "_passwordHash", "login", "email", "createdAt"
        FROM public."Users" as u
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
}
