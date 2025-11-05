import { Entity, Column, Index, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TenantContactInfo } from './contact-info.entity';
import { TenantLocation } from './tenant-location.entity';
import { SchoolInfo } from './school-info.entity';
import { TenantSubscription } from './tenant-subscription.entity';
import { TenantConfiguration } from './tenant-configuration.entity';
import { ComplianceInfo } from './compliance-info.entity';
import { SecuritySettings } from './security-settings.entity';
import { TenantUsage } from './tenant-usage.entity';
import { TenantBranding } from './tenant-branding.entity';
import { TenantIntegrations } from './tenant-integrations.entity';

export enum TenantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated',
  MIGRATING = 'migrating',
  MAINTENANCE = 'maintenance',
}

export enum TenantLifecycleStage {
  PROSPECT = 'prospect',
  TRIAL = 'trial',
  ONBOARDING = 'onboarding',
  ACTIVE = 'active',
  AT_RISK = 'at_risk',
  CHURNED = 'churned',
  REACTIVATED = 'reactivated',
}

@Entity('tenants')
@Index(['status'])
@Index(['lifecycleStage'])
@Index(['slug'], { unique: true })
@Index(['createdAt'])
export class Tenant extends BaseEntity {
  @ApiProperty({
    description: 'Tenant name',
    example: 'Springfield Elementary School',
  })
  @Column({ length: 200 })
  name: string;

  @ApiProperty({
    description: 'Tenant slug (URL-friendly identifier)',
    example: 'springfield-elementary',
  })
  @Column({ length: 100, unique: true })
  slug: string;

  @ApiProperty({
    description: 'Display name (optional, defaults to name)',
    example: 'Springfield Elementary',
    required: false,
  })
  @Column({ length: 200, nullable: true })
  displayName?: string;

  @ApiProperty({
    description: 'Tenant description',
    example:
      'A prestigious elementary school serving grades K-5 in Springfield',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Tenant status',
    enum: TenantStatus,
    example: TenantStatus.ACTIVE,
  })
  @Column({
    type: 'enum',
    enum: TenantStatus,
    default: TenantStatus.INACTIVE,
  })
  status: TenantStatus;

  @ApiProperty({
    description: 'Tenant lifecycle stage',
    enum: TenantLifecycleStage,
    example: TenantLifecycleStage.ACTIVE,
  })
  @Column({
    type: 'enum',
    enum: TenantLifecycleStage,
    default: TenantLifecycleStage.PROSPECT,
  })
  lifecycleStage: TenantLifecycleStage;

  @ApiProperty({
    description: 'Tags for categorization',
    example: ['elementary', 'public', 'urban'],
  })
  @Column({ type: 'text', array: true, default: '{}' })
  tags: string[];

  @ApiProperty({
    description: 'Additional metadata',
    example: { founded: '1985', principalName: 'John Smith' },
  })
  @Column({ type: 'jsonb', default: '{}' })
  metadata: Record<string, any>;

  // Relationships
  @OneToOne(() => TenantContactInfo, { cascade: true, eager: true })
  @JoinColumn({ name: 'contactInfoId' })
  contactInfo: TenantContactInfo;

  @OneToOne(() => TenantLocation, { cascade: true, eager: true })
  @JoinColumn({ name: 'locationId' })
  location: TenantLocation;

  @OneToOne(() => SchoolInfo, { cascade: true, eager: true })
  @JoinColumn({ name: 'schoolInfoId' })
  schoolInfo: SchoolInfo;

  @OneToOne(() => TenantSubscription, { cascade: true, eager: true })
  @JoinColumn({ name: 'subscriptionId' })
  subscription: TenantSubscription;

  @OneToOne(() => TenantConfiguration, { cascade: true, eager: true })
  @JoinColumn({ name: 'configurationId' })
  configuration: TenantConfiguration;

  @OneToOne(() => ComplianceInfo, { cascade: true, eager: true })
  @JoinColumn({ name: 'complianceId' })
  compliance: ComplianceInfo;

  @OneToOne(() => SecuritySettings, { cascade: true, eager: true })
  @JoinColumn({ name: 'securityId' })
  security: SecuritySettings;

  @OneToOne(() => TenantUsage, { cascade: true, eager: true })
  @JoinColumn({ name: 'usageId' })
  usage: TenantUsage;

  @OneToOne(() => TenantBranding, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'brandingId' })
  branding?: TenantBranding;

  @OneToOne(() => TenantIntegrations, { cascade: true, eager: true })
  @JoinColumn({ name: 'integrationsId' })
  integrations: TenantIntegrations;

  // Helper methods
  get isActive(): boolean {
    return this.status === TenantStatus.ACTIVE;
  }

  get isTrialActive(): boolean {
    return this.subscription?.trial?.isTrialActive || false;
  }

  get daysUntilRenewal(): number | null {
    if (!this.subscription?.renewalDate) return null;

    const now = new Date();
    const renewal = new Date(this.subscription.renewalDate);
    const diff = renewal.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  get isExpiringSoon(): boolean {
    const days = this.daysUntilRenewal;
    return days !== null && days <= 30;
  }

  get utilizationPercentage(): number {
    if (!this.usage || !this.subscription?.limits) return 0;

    const userUtilization =
      (this.usage.totalUsers / this.subscription.limits.maxUsers) * 100;
    const studentUtilization =
      (this.usage.totalStudents / this.subscription.limits.maxStudents) * 100;
    const storageUtilization =
      (this.usage.storageUsed / this.subscription.limits.maxStorage) * 100;

    return Math.max(userUtilization, studentUtilization, storageUtilization);
  }

  get healthScore(): number {
    // Calculate tenant health score based on various factors
    let score = 100;

    // Deduct points for high churn risk
    if (this.usage?.churnRisk) {
      score -= this.usage.churnRisk * 0.5;
    }

    // Deduct points for low uptime
    if (this.usage?.uptime && this.usage.uptime < 99) {
      score -= (99 - this.usage.uptime) * 2;
    }

    // Deduct points for high error rate
    if (this.usage?.errorRate && this.usage.errorRate > 1) {
      score -= this.usage.errorRate * 10;
    }

    // Deduct points for overutilization
    const utilization = this.utilizationPercentage;
    if (utilization > 90) {
      score -= (utilization - 90) * 2;
    }

    return Math.max(0, Math.min(100, score));
  }
}
