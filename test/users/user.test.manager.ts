import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserInputDto } from '../../src/users/api/input/userInput.dto';

export class UserTestManager {
  constructor(protected readonly app: INestApplication) {}
  expectCorrectModel(createModel: any, responseModel: any) {
    expect(createModel.name).toBe(responseModel.name);
  }
  async deleteUser(id: string) {
    await request(this.app.getHttpServer())
      .delete(`/users/${id}`)
      .auth('admin', 'qwerty')
      .expect(204);
  }
  async createUser(createUserData: UserInputDto) {
    const responce = await request(this.app.getHttpServer())
      .post('/users')
      .auth('admin', 'qwerty')
      .send(createUserData)
      .expect(201);
    return responce;
  }
  async login(
    login: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await request(this.app.getHttpServer())
      .post('/login')
      .send({ login, password })
      .expect(200);
    return {
      accessToken: response.body.accessToken,
      refreshToken: response.headers['set-cookie'][0]
        .split('=')[1]
        .split(';')[0],
    };
  }
}
