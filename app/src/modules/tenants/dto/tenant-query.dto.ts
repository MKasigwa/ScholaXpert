import {
  IsOptional,
  IsEnum,
  IsBoolean,
  IsString,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseQueryDto } from '../../../common/dto/base-query.dto';
import {
  TenantLifecycleStage,
  TenantStatus,
  //   TenantType,
  //   SubscriptionPlan,
} from '../entities/tenant.entity';
import { TenantSubscription } from '../entities/tenant-subscription.entity';

export enum TenantSortBy {
  NAME = 'name',
  CODE = 'code',
  STATUS = 'status',
  TYPE = 'type',
  SUBSCRIPTION_PLAN = 'subscriptionPlan',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export class TenantQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by tenant status',
    enum: TenantStatus,
    example: TenantStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  //   @ApiPropertyOptional({
  //     description: 'Filter by tenant type',
  //     enum: TenantType,
  //     example: TenantType.SCHOOL,
  //   })
  //   @IsOptional()
  //   @IsEnum(TenantType)
  //   type?: TenantType;

  //   @ApiPropertyOptional({
  //     description: 'Filter by subscription plan',
  //     enum: SubscriptionPlan,
  //     example: SubscriptionPlan.PROFESSIONAL,
  //   })
  //   @IsOptional()
  //   @IsEnum(SubscriptionPlan)
  //   subscriptionPlan?: SubscriptionPlan;

  @ApiPropertyOptional({
    description: 'Filter by subscription status',
    example: 'active',
  })
  @IsOptional()
  @IsString()
  subscriptionStatus?: string;

  @ApiPropertyOptional({
    description: 'Filter by region',
    example: 'active',
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({
    description: 'Filter by schoolType',
    example: 'active',
  })
  @IsOptional()
  @IsString()
  schoolType?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Filter tenants with trial ending soon (days)',
    example: 7,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  trialEndingSoon?: number;

  @ApiPropertyOptional({
    description: 'Filter tenants created after date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  createdAfter?: string;

  @ApiPropertyOptional({
    description: 'Filter tenants created before date',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  createdBefore?: string;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: TenantSortBy,
    example: TenantSortBy.NAME,
  })
  @IsOptional()
  @IsEnum(TenantSortBy)
  sortBy?: TenantSortBy = TenantSortBy.CREATED_AT;

  @ApiPropertyOptional({
    description: 'Include statistics (users count, students count, etc.)',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeStats?: boolean = false;

  @ApiPropertyOptional({
    description: 'Filter by country',
    example: 'United States',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Filter by state/province',
    example: 'California',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsEnum(TenantLifecycleStage)
  lifecycleStage?: TenantLifecycleStage;

  @IsOptional()
  @IsEnum(TenantSubscription)
  subscriptionPlan?: TenantSubscription;
}
