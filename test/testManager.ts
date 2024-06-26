import { INestApplication } from '@nestjs/common';
import request from 'supertest';

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
}
