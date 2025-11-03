import { Test, TestingModule } from '@nestjs/testing';
import { SchoolYearsController } from './school-years.controller';

describe('SchoolYearsController', () => {
  let controller: SchoolYearsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolYearsController],
    }).compile();

    controller = module.get<SchoolYearsController>(SchoolYearsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
