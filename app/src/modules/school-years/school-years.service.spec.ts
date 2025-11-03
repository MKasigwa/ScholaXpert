import { Test, TestingModule } from '@nestjs/testing';
import { SchoolYearsService } from './school-years.service';

describe('SchoolYearsService', () => {
  let service: SchoolYearsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchoolYearsService],
    }).compile();

    service = module.get<SchoolYearsService>(SchoolYearsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
