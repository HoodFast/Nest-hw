import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserTestManager } from './users/user.test.manager';
import { randomUUID } from 'crypto';

export class TestManager {
  constructor(protected readonly app: INestApplication) {}
  expectCorrectModel(createModel: any, responseModel: any) {
    expect(createModel.name).toBe(responseModel.name);
  }

  async deleteAll() {
    await request(this.app.getHttpServer())
      .delete(`/testing/all-data`)
      .expect(204);
  }

  async createAccessToken() {
    const httpServer = this.app.getHttpServer();
    const userTestManager = new UserTestManager(this.app);
    const random = randomUUID();
    const createUserData = {
      login: `user ${random.substring(0, 3)}`,
      password: `${random.substring(0, 6)}`,
      email: `usermail${random}@mail.ru`,
    };
    await userTestManager.createUser(createUserData, 201);
    const userResponse = await request(httpServer).post('/auth/login').send({
      loginOrEmail: createUserData.login,
      password: createUserData.password,
    });
    return userResponse.body.accessToken;
  }
}
