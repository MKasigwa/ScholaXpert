import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TenantIntegrations } from './tenant-integrations.entity';

export enum CommunicationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH_NOTIFICATION = 'push_notification',
  VOICE = 'voice',
}

@Entity('communication_integrations')
export class CommunicationIntegration extends BaseEntity {
  @ApiProperty({
    description: 'Communication type',
    enum: CommunicationType,
    example: CommunicationType.EMAIL,
  })
  @Column({
    type: 'enum',
    enum: CommunicationType,
  })
  type: CommunicationType;

  @ApiProperty({ description: 'Provider name', example: 'SendGrid' })
  @Column({ length: 100 })
  provider: string;

  @ApiProperty({ description: 'Integration enabled', example: true })
  @Column({ type: 'boolean', default: false })
  enabled: boolean;

  @ApiProperty({ description: 'Configuration settings' })
  @Column({ type: 'jsonb', default: '{}' })
  configuration: Record<string, any>;

  @ManyToOne(
    () => TenantIntegrations,
    (integrations) => integrations.communicationTools,
  )
  tenantIntegrations: TenantIntegrations;
}
