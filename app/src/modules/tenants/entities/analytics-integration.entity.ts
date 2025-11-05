import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TenantIntegrations } from './tenant-integrations.entity';

export enum AnalyticsProvider {
  GOOGLE_ANALYTICS = 'google_analytics',
  MIXPANEL = 'mixpanel',
  SEGMENT = 'segment',
  OTHER = 'other',
}

@Entity('analytics_integrations')
export class AnalyticsIntegration extends BaseEntity {
  @ApiProperty({
    description: 'Analytics provider',
    enum: AnalyticsProvider,
    example: AnalyticsProvider.GOOGLE_ANALYTICS,
  })
  @Column({
    type: 'enum',
    enum: AnalyticsProvider,
  })
  provider: AnalyticsProvider;

  @ApiProperty({ description: 'Integration enabled', example: true })
  @Column({ type: 'boolean', default: false })
  enabled: boolean;

  @ApiProperty({ description: 'Tracking ID', example: 'GA-123456789' })
  @Column({ length: 100 })
  trackingId: string;

  @ApiProperty({ description: 'Configuration settings' })
  @Column({ type: 'jsonb', default: '{}' })
  configuration: Record<string, any>;

  @ManyToOne(
    () => TenantIntegrations,
    (integrations) => integrations.analyticsIntegrations,
  )
  tenantIntegrations: TenantIntegrations;
}
