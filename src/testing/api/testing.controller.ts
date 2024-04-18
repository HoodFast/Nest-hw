import { Controller, Delete, Res } from '@nestjs/common';
import { TestingQueryRepository } from '../infrastructure/testing.query.repository';
import { Response } from 'express';

@Controller('testing/all-data')
export class TestingController {
  constructor(private testingQueryRepository: TestingQueryRepository) {}
  @Delete()
  async deleteAll(@Res({ passthrough: true }) res: Response) {
    await this.testingQueryRepository.deleteAll();
    return res.sendStatus(204);
  }
}
