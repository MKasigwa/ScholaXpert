import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { BaseQueryDto } from '../../../common/dto/base-query.dto';
import {
  SubscriberStatus,
  SubscriberSource,
} from '../entities/waitlist-subscriber.entity';

export class SubscriberQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsEnum(SubscriberStatus)
  status?: SubscriberStatus;

  @IsOptional()
  @IsEnum(SubscriberSource)
  source?: SubscriberSource;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  country?: string;

  @IsOptional()
  locale?: string;
}
