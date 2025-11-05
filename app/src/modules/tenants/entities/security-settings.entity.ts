import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { SecurityIncident } from './security-incident.entity';

@Entity('security_settings')
export class SecuritySettings extends BaseEntity {
  @ApiProperty({ description: 'MFA required', example: false })
  @Column({ type: 'boolean', default: false })
  mfaRequired: boolean;

  @ApiProperty({ description: 'SSO enabled', example: false })
  @Column({ type: 'boolean', default: false })
  ssoEnabled: boolean;

  @ApiProperty({
    description: 'SSO provider',
    example: 'google',
    required: false,
  })
  @Column({ length: 100, nullable: true })
  ssoProvider?: string;

  @ApiProperty({ description: 'Session timeout in minutes', example: 120 })
  @Column({ type: 'int', default: 120 })
  sessionTimeout: number;

  @ApiProperty({ description: 'RBAC enabled', example: true })
  @Column({ type: 'boolean', default: true })
  rbacEnabled: boolean;

  @ApiProperty({ description: 'Custom roles allowed', example: false })
  @Column({ type: 'boolean', default: false })
  customRoles: boolean;

  @ApiProperty({ description: 'IP whitelisting enabled', example: false })
  @Column({ type: 'boolean', default: false })
  ipWhitelisting: boolean;

  @ApiProperty({
    description: 'Allowed IP addresses',
    example: ['192.168.1.0/24'],
  })
  @Column({ type: 'text', array: true, default: '{}' })
  allowedIPs: string[];

  @ApiProperty({ description: 'Encryption at rest', example: true })
  @Column({ type: 'boolean', default: true })
  encryptionAtRest: boolean;

  @ApiProperty({ description: 'Encryption in transit', example: true })
  @Column({ type: 'boolean', default: true })
  encryptionInTransit: boolean;

  @ApiProperty({ description: 'Audit logging enabled', example: true })
  @Column({ type: 'boolean', default: true })
  auditLogging: boolean;

  @ApiProperty({ description: 'Real-time monitoring', example: false })
  @Column({ type: 'boolean', default: false })
  realTimeMonitoring: boolean;

  @ApiProperty({ description: 'Backup encryption', example: true })
  @Column({ type: 'boolean', default: true })
  backupEncryption: boolean;

  @ApiProperty({ description: 'Disaster recovery enabled', example: false })
  @Column({ type: 'boolean', default: false })
  disasterRecovery: boolean;

  @ApiProperty({
    description: 'Recovery Point Objective in hours',
    example: 24,
  })
  @Column({ type: 'int', default: 24 })
  rpo: number;

  @ApiProperty({ description: 'Recovery Time Objective in hours', example: 4 })
  @Column({ type: 'int', default: 4 })
  rto: number;

  @OneToMany(() => SecurityIncident, (incident) => incident.securitySettings, {
    cascade: true,
  })
  securityIncidents: SecurityIncident[];
}
