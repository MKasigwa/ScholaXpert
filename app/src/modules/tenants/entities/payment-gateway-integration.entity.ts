import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TenantIntegrations } from './tenant-integrations.entity';

export enum PaymentProvider {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  SQUARE = 'square',
  RAZORPAY = 'razorpay',
  OTHER = 'other',
}

@Entity('payment_gateway_integrations')
export class PaymentGatewayIntegration extends BaseEntity {
  @ApiProperty({
    description: 'Payment provider',
    enum: PaymentProvider,
    example: PaymentProvider.STRIPE,
  })
  @Column({
    type: 'enum',
    enum: PaymentProvider,
  })
  provider: PaymentProvider;

  @ApiProperty({ description: 'Integration enabled', example: true })
  @Column({ type: 'boolean', default: false })
  enabled: boolean;

  @ApiProperty({ description: 'Configuration settings' })
  @Column({ type: 'jsonb', default: '{}' })
  configuration: Record<string, any>;

  @ApiProperty({ description: 'Test mode enabled', example: true })
  @Column({ type: 'boolean', default: true })
  testMode: boolean;

  @ManyToOne(
    () => TenantIntegrations,
    (integrations) => integrations.paymentGateways,
  )
  tenantIntegrations: TenantIntegrations;
}
