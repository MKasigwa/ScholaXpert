import { Test, TestingModule } from '@nestjs/testing';
import { WaitlistController } from './waitlist.controller';

describe('WaitlistController', () => {
  let controller: WaitlistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitlistController],
    }).compile();

    controller = module.get<WaitlistController>(WaitlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
