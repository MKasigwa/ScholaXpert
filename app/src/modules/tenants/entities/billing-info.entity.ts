import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Address } from './address.entity';

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  INVOICE = 'invoice',
  CHECK = 'check',
}

export enum BillingStatus {
  CURRENT = 'current',
  OVERDUE = 'overdue',
  FAILED = 'failed',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

@Entity('billing_infos')
export class BillingInfo extends BaseEntity {
  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @ApiProperty({
    description: 'Billing status',
    enum: BillingStatus,
    example: BillingStatus.CURRENT,
  })
  @Column({
    type: 'enum',
    enum: BillingStatus,
  })
  status: BillingStatus;

  @ApiProperty({
    description: 'Next billing date',
    example: '2024-02-01T00:00:00.000Z',
  })
  @Column({ type: 'timestamp with time zone' })
  nextBillingDate: Date;

  @ApiProperty({
    description: 'Last payment date',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  @Column({ type: 'timestamp with time zone', nullable: true })
  lastPaymentDate?: Date;

  @ApiProperty({
    description: 'Last payment amount',
    example: 199.99,
    required: false,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  lastPaymentAmount?: number;

  @ApiProperty({
    description: 'Outstanding balance',
    example: 0.0,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  outstandingBalance: number;

  @ApiProperty({
    description: 'Payment details (encrypted)',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  paymentDetails?: {
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };

  @ApiProperty({
    description: 'Invoice IDs',
    example: ['inv_001', 'inv_002'],
  })
  @Column({ type: 'text', array: true, default: '{}' })
  invoices: string[];

  @OneToOne(() => Address, { cascade: true, eager: true, nullable: true })
  @JoinColumn({ name: 'billingAddressId' })
  billingAddress?: Address;
}
