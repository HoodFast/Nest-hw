import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../../src/app.module';
import { appSettings } from '../../src/settings/app.settings';
import { UsersService } from '../../src/users/application/users.service';

import request from 'supertest';
import { UsersServiceEmailMock } from '../users/mock/email.mock.class';
import { UserTestManager } from '../users/user.test.manager';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let httpServer;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersService)
      .useClass(UsersServiceEmailMock)
      .compile();

    app = moduleFixture.createNestApplication();
    appSettings(app);
    await app.init();
    httpServer = app.getHttpServer();
  });
  afterAll(async () => {
    const userTestManager = new UserTestManager(app);
    await userTestManager.deleteAll();
  });
  expect.setState({
    createUserData: {
      login: 'Fj5ll0T',
      password: 'string',
      email: '6Ya0V21@raLn.Je',
    },
    createWrongUserData: {
      login: 'Fj',
      password: 'string',
      email: '6Ya0V21raLn.Je',
    },
  });
  it('-password-recovery incorrect email', async () => {
    await request(httpServer)
      .post('/auth/password-recovery')
      .send({ email: 1234 })
      .expect(400);
  });
  it('-new-password incorrect data', async () => {
    await request(httpServer)
      .post('/auth/new-password')
      .send({ newPassword: 'string', recoveryCode: 'string' })
      .expect(400);
  });
  it('-new-password incorrect code', async () => {
    await request(httpServer)
      .post('/auth/new-password')
      .send({ newPassword: 'string', recoveryCode: 'string11111' })
      .expect(400);
  });
});
