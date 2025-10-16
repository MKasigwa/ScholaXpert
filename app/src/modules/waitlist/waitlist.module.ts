import { Module } from '@nestjs/common';
import { WaitlistController } from './waitlist.controller';
import { WaitlistService } from './waitlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaitlistSubscriber } from './entities/waitlist-subscriber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WaitlistSubscriber])],
  controllers: [WaitlistController],
  providers: [WaitlistService],
  exports: [WaitlistService],
})
export class WaitlistModule {}
