import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('feature_limits')
export class FeatureLimits extends BaseEntity {
  @ApiProperty({ description: 'Custom branding allowed', example: true })
  @Column({ type: 'boolean', default: false })
  customBranding: boolean;

  @ApiProperty({ description: 'API access allowed', example: true })
  @Column({ type: 'boolean', default: false })
  apiAccess: boolean;

  @ApiProperty({ description: 'SSO integration allowed', example: true })
  @Column({ type: 'boolean', default: false })
  ssoIntegration: boolean;

  @ApiProperty({ description: 'Advanced reports allowed', example: true })
  @Column({ type: 'boolean', default: false })
  advancedReports: boolean;

  @ApiProperty({ description: 'Mobile app access', example: true })
  @Column({ type: 'boolean', default: false })
  mobileApp: boolean;

  @ApiProperty({ description: 'Parent portal access', example: true })
  @Column({ type: 'boolean', default: true })
  parentPortal: boolean;

  @ApiProperty({ description: 'Student portal access', example: true })
  @Column({ type: 'boolean', default: true })
  studentPortal: boolean;

  @ApiProperty({ description: 'Bulk operations allowed', example: true })
  @Column({ type: 'boolean', default: false })
  bulkOperations: boolean;

  @ApiProperty({ description: 'Data export allowed', example: true })
  @Column({ type: 'boolean', default: false })
  dataExport: boolean;

  @ApiProperty({ description: 'Automated backups', example: true })
  @Column({ type: 'boolean', default: false })
  automatedBackups: boolean;

  @ApiProperty({ description: 'Priority support', example: true })
  @Column({ type: 'boolean', default: false })
  prioritySupport: boolean;

  @ApiProperty({ description: 'Dedicated account manager', example: false })
  @Column({ type: 'boolean', default: false })
  dedicatedAccountManager: boolean;
}
