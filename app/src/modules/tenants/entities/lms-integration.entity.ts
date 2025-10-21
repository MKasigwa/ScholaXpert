import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TenantIntegrations } from './tenant-integrations.entity';

export enum LmsProvider {
  GOOGLE_CLASSROOM = 'google_classroom',
  CANVAS = 'canvas',
  MOODLE = 'moodle',
  BLACKBOARD = 'blackboard',
  OTHER = 'other',
}

export enum SyncStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  IN_PROGRESS = 'in_progress',
  NEVER = 'never',
}

@Entity('lms_integrations')
export class LmsIntegration extends BaseEntity {
  @ApiProperty({
    description: 'LMS provider',
    enum: LmsProvider,
    example: LmsProvider.GOOGLE_CLASSROOM,
  })
  @Column({
    type: 'enum',
    enum: LmsProvider,
  })
  provider: LmsProvider;

  @ApiProperty({ description: 'Integration enabled', example: true })
  @Column({ type: 'boolean', default: false })
  enabled: boolean;

  @ApiProperty({ description: 'Configuration settings' })
  @Column({ type: 'jsonb', default: '{}' })
  configuration: Record<string, any>;

  @ApiProperty({ description: 'Last sync date', required: false })
  @Column({ type: 'timestamp with time zone', nullable: true })
  lastSyncDate?: Date;

  @ApiProperty({
    description: 'Sync status',
    enum: SyncStatus,
    example: SyncStatus.SUCCESS,
  })
  @Column({
    type: 'enum',
    enum: SyncStatus,
    default: SyncStatus.NEVER,
  })
  syncStatus: SyncStatus;

  @ManyToOne(
    () => TenantIntegrations,
    (integrations) => integrations.lmsIntegrations,
  )
  tenantIntegrations: TenantIntegrations;
}
