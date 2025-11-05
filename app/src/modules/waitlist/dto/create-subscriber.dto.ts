import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  IsEnum,
  IsObject,
} from 'class-validator';
import { SubscriberSource } from '../entities/waitlist-subscriber.entity';

export class CreateSubscriberDto {
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  organization?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  role?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsEnum(SubscriberSource)
  source?: SubscriberSource;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  locale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  referralCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  utmSource?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  utmMedium?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  utmCampaign?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  @MaxLength(45)
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
