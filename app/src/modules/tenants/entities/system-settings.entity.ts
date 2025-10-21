import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PasswordPolicy } from './password-policy.entity';

export enum BackupFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  NEVER = 'never',
}

@Entity('system_settings')
export class SystemSettings extends BaseEntity {
  @ApiProperty({ description: 'Maintenance mode enabled', example: false })
  @Column({ type: 'boolean', default: false })
  maintenanceMode: boolean;

  @ApiProperty({ description: 'Debug mode enabled', example: false })
  @Column({ type: 'boolean', default: false })
  debugMode: boolean;

  @ApiProperty({ description: 'Allow user registration', example: true })
  @Column({ type: 'boolean', default: true })
  allowRegistration: boolean;

  @ApiProperty({ description: 'Require email verification', example: true })
  @Column({ type: 'boolean', default: true })
  requireEmailVerification: boolean;

  @ApiProperty({ description: 'Session timeout in minutes', example: 120 })
  @Column({ type: 'int', default: 120 })
  sessionTimeout: number;

  @ApiProperty({
    description: 'Backup frequency',
    enum: BackupFrequency,
    example: BackupFrequency.DAILY,
  })
  @Column({
    type: 'enum',
    enum: BackupFrequency,
    default: BackupFrequency.WEEKLY,
  })
  backupFrequency: BackupFrequency;

  @ApiProperty({ description: 'Data retention period in days', example: 2555 })
  @Column({ type: 'int', default: 2555 }) // 7 years
  dataRetentionPeriod: number;

  @OneToOne(() => PasswordPolicy, { cascade: true, eager: true })
  @JoinColumn({ name: 'passwordPolicyId' })
  passwordPolicy: PasswordPolicy;
}
