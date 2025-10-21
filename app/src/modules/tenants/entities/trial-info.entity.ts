import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

enum SubscriptionPlan {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
  CUSTOM = 'custom',
}

@Entity('trial_infos')
export class TrialInfo extends BaseEntity {
  @ApiProperty({
    description: 'Is trial currently active',
    example: true,
  })
  @Column({ type: 'boolean' })
  isTrialActive: boolean;

  @ApiProperty({
    description: 'Trial start date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Column({ type: 'timestamp with time zone' })
  trialStartDate: Date;

  @ApiProperty({
    description: 'Trial end date',
    example: '2024-01-31T23:59:59.000Z',
  })
  @Column({ type: 'timestamp with time zone' })
  trialEndDate: Date;

  @ApiProperty({
    description: 'Trial days remaining',
    example: 15,
  })
  @Column({ type: 'int' })
  trialDaysRemaining: number;

  @ApiProperty({
    description: 'Trial plan',
    enum: SubscriptionPlan,
    example: SubscriptionPlan.PROFESSIONAL,
  })
  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
    enumName: 'trialPlan',
  })
  trialPlan: SubscriptionPlan;

  @ApiProperty({
    description: 'Converted from trial',
    example: false,
  })
  @Column({ type: 'boolean', default: false })
  convertedFromTrial: boolean;

  @ApiProperty({
    description: 'Extensions used',
    example: 0,
  })
  @Column({ type: 'int', default: 0 })
  extensionsUsed: number;

  @ApiProperty({
    description: 'Maximum extensions allowed',
    example: 2,
  })
  @Column({ type: 'int', default: 2 })
  maxExtensions: number;
}
