import { Test, TestingModule } from '@nestjs/testing';
import { TenantAccessController } from './tenant-access.controller';

describe('TenantAccessController', () => {
  let controller: TenantAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantAccessController],
    }).compile();

    controller = module.get<TenantAccessController>(TenantAccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
