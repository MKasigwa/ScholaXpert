import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('tenant_features')
export class TenantFeatures extends BaseEntity {
  @ApiProperty({ description: 'Academic management', example: true })
  @Column({ type: 'boolean', default: true })
  academicManagement: boolean;

  @ApiProperty({ description: 'Fee management', example: true })
  @Column({ type: 'boolean', default: true })
  feeManagement: boolean;

  @ApiProperty({ description: 'Library management', example: true })
  @Column({ type: 'boolean', default: false })
  libraryManagement: boolean;

  @ApiProperty({ description: 'Transport management', example: false })
  @Column({ type: 'boolean', default: false })
  transportManagement: boolean;

  @ApiProperty({ description: 'Inventory management', example: false })
  @Column({ type: 'boolean', default: false })
  inventoryManagement: boolean;

  @ApiProperty({ description: 'HR management', example: false })
  @Column({ type: 'boolean', default: false })
  hrManagement: boolean;

  @ApiProperty({ description: 'Parent portal', example: true })
  @Column({ type: 'boolean', default: true })
  parentPortal: boolean;

  @ApiProperty({ description: 'Student portal', example: true })
  @Column({ type: 'boolean', default: true })
  studentPortal: boolean;

  @ApiProperty({ description: 'Mobile app', example: false })
  @Column({ type: 'boolean', default: false })
  mobileApp: boolean;

  @ApiProperty({ description: 'Reports and analytics', example: true })
  @Column({ type: 'boolean', default: true })
  reportsAnalytics: boolean;

  @ApiProperty({ description: 'Timetable management', example: true })
  @Column({ type: 'boolean', default: true })
  timetableManagement: boolean;

  @ApiProperty({ description: 'Communication tools', example: true })
  @Column({ type: 'boolean', default: true })
  communicationTools: boolean;

  @ApiProperty({ description: 'Exam management', example: true })
  @Column({ type: 'boolean', default: true })
  examManagement: boolean;

  @ApiProperty({ description: 'Discipline tracking', example: false })
  @Column({ type: 'boolean', default: false })
  disciplineTracking: boolean;

  @ApiProperty({ description: 'Health records', example: false })
  @Column({ type: 'boolean', default: false })
  healthRecords: boolean;

  @ApiProperty({ description: 'Custom fields', example: false })
  @Column({ type: 'boolean', default: false })
  customFields: boolean;

  @ApiProperty({ description: 'API access', example: false })
  @Column({ type: 'boolean', default: false })
  apiAccess: boolean;

  @ApiProperty({ description: 'SSO integration', example: false })
  @Column({ type: 'boolean', default: false })
  ssoIntegration: boolean;

  @ApiProperty({ description: 'Custom branding', example: false })
  @Column({ type: 'boolean', default: false })
  customBranding: boolean;

  @ApiProperty({ description: 'Advanced security', example: false })
  @Column({ type: 'boolean', default: false })
  advancedSecurity: boolean;
}
