import { Entity, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { SystemSettings } from './system-settings.entity';
import { TenantFeatures } from './tenant-features.entity';
import { TenantLimits } from './tenant-limits.entity';
import { TenantCustomizations } from './tenant-customizations.entity';
import { ApiSettings } from './api-settings.entity';

@Entity('tenant_configurations')
export class TenantConfiguration extends BaseEntity {
  @OneToOne(() => SystemSettings, { cascade: true, eager: true })
  @JoinColumn({ name: 'systemSettingsId' })
  systemSettings: SystemSettings;

  @OneToOne(() => TenantFeatures, { cascade: true, eager: true })
  @JoinColumn({ name: 'featuresId' })
  features: TenantFeatures;

  @OneToOne(() => TenantLimits, { cascade: true, eager: true })
  @JoinColumn({ name: 'limitsId' })
  limits: TenantLimits;

  @OneToOne(() => TenantCustomizations, { cascade: true, eager: true })
  @JoinColumn({ name: 'customizationsId' })
  customizations: TenantCustomizations;

  @OneToOne(() => ApiSettings, { cascade: true, eager: true })
  @JoinColumn({ name: 'apiSettingsId' })
  apiSettings: ApiSettings;
}
