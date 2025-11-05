import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { SubscriptionLimits } from './subscription-limits.entity';
import { BillingInfo } from './billing-info.entity';
import { TrialInfo } from './trial-info.entity';

export enum SubscriptionPlan {
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
  CUSTOM = 'custom',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
  BIENNIAL = 'biennial',
}

@Entity('tenant_subscriptions')
export class TenantSubscription extends BaseEntity {
  @ApiProperty({
    description: 'Subscription plan',
    enum: SubscriptionPlan,
    example: SubscriptionPlan.PROFESSIONAL,
  })
  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
  })
  plan: SubscriptionPlan;

  @ApiProperty({
    description: 'Subscription status',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.ACTIVE,
  })
  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
  })
  status: SubscriptionStatus;

  @ApiProperty({
    description: 'Billing cycle',
    enum: BillingCycle,
    example: BillingCycle.ANNUAL,
  })
  @Column({
    type: 'enum',
    enum: BillingCycle,
  })
  billingCycle: BillingCycle;

  @ApiProperty({
    description: 'Subscription start date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Column({ type: 'timestamp with time zone' })
  startDate: Date;

  @ApiProperty({
    description: 'Subscription end date',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  @Column({ type: 'timestamp with time zone', nullable: true })
  endDate?: Date;

  @ApiProperty({
    description: 'Renewal date',
    example: '2024-12-31T23:59:59.000Z',
  })
  @Column({ type: 'timestamp with time zone' })
  renewalDate: Date;

  @ApiProperty({
    description: 'Base price',
    example: 99.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @ApiProperty({
    description: 'Additional user price',
    example: 5.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  additionalUserPrice: number;

  @ApiProperty({
    description: 'Total price',
    example: 199.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @ApiProperty({
    description: 'Currency',
    example: 'USD',
  })
  @Column({ length: 3 })
  currency: string;

  @ApiProperty({
    description: 'Discount information',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    code?: string;
    validUntil?: Date;
    reason?: string;
  };

  @ApiProperty({
    description: 'Usage tracking enabled',
    example: true,
  })
  @Column({ type: 'boolean', default: true })
  usageTracking: boolean;

  @ApiProperty({
    description: 'Overage charges enabled',
    example: false,
  })
  @Column({ type: 'boolean', default: false })
  overageCharges: boolean;

  @OneToOne(() => SubscriptionLimits, { cascade: true, eager: true })
  @JoinColumn({ name: 'limitsId' })
  limits: SubscriptionLimits;

  @OneToOne(() => BillingInfo, { cascade: true, eager: true })
  @JoinColumn({ name: 'billingInfoId' })
  billing: BillingInfo;

  @OneToOne(() => TrialInfo, { cascade: true, eager: true, nullable: true })
  @JoinColumn({ name: 'trialInfoId' })
  trial?: TrialInfo;
}
