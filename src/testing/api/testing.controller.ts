import { Controller, Delete } from '@nestjs/common';
import { TestingQueryRepository } from '../infrastructure/testing.query.repository';

@Controller('testing/all-data')
export class TestingController {
  constructor(private testingQueryRepository: TestingQueryRepository) {}
  @Delete()
  async deleteAll(): Promise<boolean> {
    const deleteAll = await this.testingQueryRepository.deleteAll();
    return deleteAll;
  }
}
