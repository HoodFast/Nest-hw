import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../../src/app.module';
import { appSettings } from '../../src/settings/app.settings';
import { UsersService } from '../../src/users/application/users.service';
import { UsersServiceEmailMock } from './mock/email.mock.class';
import { UserInputDto } from '../../src/users/api/input/userInput.dto';
import { UserTestManager } from './user.test.manager';
import { response } from 'express';

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

  it('create user this correct data', async () => {
    const userTestManager = new UserTestManager(app);
    const createUserData: UserInputDto = {
      login: 'Fj5ll0T',
      password: 'string',
      email: '6Ya0V21@raLn.Je',
    };
    const response = await userTestManager.createUser(createUserData);

    expect(response.body).toEqual({
      login: createUserData.login,
      email: createUserData.email,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
    await userTestManager.deleteUser(response.body.id);
  });
});
