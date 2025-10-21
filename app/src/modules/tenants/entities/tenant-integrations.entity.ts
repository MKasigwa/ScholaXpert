import { Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { LmsIntegration } from './lms-integration.entity';
import { PaymentGatewayIntegration } from './payment-gateway-integration.entity';
import { CommunicationIntegration } from './communication-integration.entity';
import { AnalyticsIntegration } from './analytics-integration.entity';
import { SsoIntegration } from './sso-integration.entity';
import { CustomIntegration } from './custom-integration.entity';

@Entity('tenant_integrations')
export class TenantIntegrations extends BaseEntity {
  @OneToMany(
    () => LmsIntegration,
    (integration) => integration.tenantIntegrations,
    {
      cascade: true,
      eager: true,
    },
  )
  lmsIntegrations: LmsIntegration[];

  @OneToMany(
    () => PaymentGatewayIntegration,
    (integration) => integration.tenantIntegrations,
    {
      cascade: true,
      eager: true,
    },
  )
  paymentGateways: PaymentGatewayIntegration[];

  @OneToMany(
    () => CommunicationIntegration,
    (integration) => integration.tenantIntegrations,
    {
      cascade: true,
      eager: true,
    },
  )
  communicationTools: CommunicationIntegration[];

  @OneToMany(
    () => AnalyticsIntegration,
    (integration) => integration.tenantIntegrations,
    {
      cascade: true,
      eager: true,
    },
  )
  analyticsIntegrations: AnalyticsIntegration[];

  @OneToMany(
    () => SsoIntegration,
    (integration) => integration.tenantIntegrations,
    {
      cascade: true,
      eager: true,
    },
  )
  ssoProviders: SsoIntegration[];

  @OneToMany(
    () => CustomIntegration,
    (integration) => integration.tenantIntegrations,
    {
      cascade: true,
      eager: true,
    },
  )
  customIntegrations: CustomIntegration[];
}
