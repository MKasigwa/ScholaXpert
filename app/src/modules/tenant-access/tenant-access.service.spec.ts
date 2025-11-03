import { Test, TestingModule } from '@nestjs/testing';
import { TenantAccessService } from './tenant-access.service';

describe('TenantAccessService', () => {
  let service: TenantAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantAccessService],
    }).compile();

    service = module.get<TenantAccessService>(TenantAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
