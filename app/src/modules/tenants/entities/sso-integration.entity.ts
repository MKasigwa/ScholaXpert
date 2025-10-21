import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TenantIntegrations } from './tenant-integrations.entity';

export enum SsoProvider {
  GOOGLE = 'google',
  MICROSOFT = 'microsoft',
  OKTA = 'okta',
  AUTH0 = 'auth0',
  SAML = 'saml',
  OTHER = 'other',
}

@Entity('sso_integrations')
export class SsoIntegration extends BaseEntity {
  @ApiProperty({
    description: 'SSO provider',
    enum: SsoProvider,
    example: SsoProvider.GOOGLE,
  })
  @Column({
    type: 'enum',
    enum: SsoProvider,
  })
  provider: SsoProvider;

  @ApiProperty({ description: 'Integration enabled', example: true })
  @Column({ type: 'boolean', default: false })
  enabled: boolean;

  @ApiProperty({ description: 'Configuration settings' })
  @Column({ type: 'jsonb', default: '{}' })
  configuration: Record<string, any>;

  @ManyToOne(
    () => TenantIntegrations,
    (integrations) => integrations.ssoProviders,
  )
  tenantIntegrations: TenantIntegrations;
}
