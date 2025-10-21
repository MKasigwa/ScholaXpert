import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TenantIntegrations } from './tenant-integrations.entity';

@Entity('custom_integrations')
export class CustomIntegration extends BaseEntity {
  @ApiProperty({
    description: 'Integration name',
    example: 'School Bus Tracker',
  })
  @Column({ length: 200 })
  name: string;

  @ApiProperty({ description: 'Integration type', example: 'webhook' })
  @Column({ length: 100 })
  type: string;

  @ApiProperty({ description: 'Integration enabled', example: true })
  @Column({ type: 'boolean', default: false })
  enabled: boolean;

  @ApiProperty({ description: 'Endpoint URL', required: false })
  @Column({ length: 500, nullable: true })
  endpoint?: string;

  @ApiProperty({ description: 'Configuration settings' })
  @Column({ type: 'jsonb', default: '{}' })
  configuration: Record<string, any>;

  @ManyToOne(
    () => TenantIntegrations,
    (integrations) => integrations.customIntegrations,
  )
  tenantIntegrations: TenantIntegrations;
}
