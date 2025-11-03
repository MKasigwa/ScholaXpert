import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';

// Import all entities
import { Tenant } from './entities/tenant.entity';
import { TenantContactInfo } from './entities/contact-info.entity';
import { ContactPerson } from './entities/contact-person.entity';
import { Address } from './entities/address.entity';
import { TenantLocation } from './entities/tenant-location.entity';
import { SchoolInfo } from './entities/school-info.entity';
import { AccreditationInfo } from './entities/accreditation-info.entity';
import { TenantSubscription } from './entities/tenant-subscription.entity';
import { SubscriptionLimits } from './entities/subscription-limits.entity';
import { FeatureLimits } from './entities/feature-limits.entity';
import { BillingInfo } from './entities/billing-info.entity';
import { TrialInfo } from './entities/trial-info.entity';
import { TenantConfiguration } from './entities/tenant-configuration.entity';
import { SystemSettings } from './entities/system-settings.entity';
import { PasswordPolicy } from './entities/password-policy.entity';
import { TenantFeatures } from './entities/tenant-features.entity';
import { TenantLimits } from './entities/tenant-limits.entity';
import { TenantCustomizations } from './entities/tenant-customizations.entity';
import { ApiSettings } from './entities/api-settings.entity';
import { ComplianceInfo } from './entities/compliance-info.entity';
import { ComplianceCertification } from './entities/compliance-certification.entity';
import { SecuritySettings } from './entities/security-settings.entity';
import { SecurityIncident } from './entities/security-incident.entity';
import { TenantUsage } from './entities/tenant-usage.entity';
import { TenantBranding } from './entities/tenant-branding.entity';
import { TenantIntegrations } from './entities/tenant-integrations.entity';
import { LmsIntegration } from './entities/lms-integration.entity';
import { PaymentGatewayIntegration } from './entities/payment-gateway-integration.entity';
import { CommunicationIntegration } from './entities/communication-integration.entity';
import { AnalyticsIntegration } from './entities/analytics-integration.entity';
import { SsoIntegration } from './entities/sso-integration.entity';
import { CustomIntegration } from './entities/custom-integration.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Main tenant entity
      Tenant,

      // Contact and location entities
      TenantContactInfo,
      ContactPerson,
      Address,
      TenantLocation,

      // User entity (for tenant assignment)
      User,

      // School information entities
      SchoolInfo,
      AccreditationInfo,

      // Subscription related entities
      TenantSubscription,
      SubscriptionLimits,
      FeatureLimits,
      BillingInfo,
      TrialInfo,

      // Configuration entities
      TenantConfiguration,
      SystemSettings,
      PasswordPolicy,
      TenantFeatures,
      TenantLimits,
      TenantCustomizations,
      ApiSettings,

      // Compliance and security entities
      ComplianceInfo,
      ComplianceCertification,
      SecuritySettings,
      SecurityIncident,

      // Usage and branding entities
      TenantUsage,
      TenantBranding,

      // Integration entities
      TenantIntegrations,
      LmsIntegration,
      PaymentGatewayIntegration,
      CommunicationIntegration,
      AnalyticsIntegration,
      SsoIntegration,
      CustomIntegration,
    ]),
  ],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
