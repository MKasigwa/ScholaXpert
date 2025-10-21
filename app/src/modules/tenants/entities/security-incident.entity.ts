import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { SecuritySettings } from './security-settings.entity';

export enum IncidentType {
  BREACH = 'breach',
  ATTEMPT = 'attempt',
  VULNERABILITY = 'vulnerability',
  POLICY_VIOLATION = 'policy_violation',
}

export enum IncidentSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum IncidentStatus {
  OPEN = 'open',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('security_incidents')
export class SecurityIncident extends BaseEntity {
  @ApiProperty({
    description: 'Incident type',
    enum: IncidentType,
    example: IncidentType.ATTEMPT,
  })
  @Column({
    type: 'enum',
    enum: IncidentType,
  })
  type: IncidentType;

  @ApiProperty({
    description: 'Incident severity',
    enum: IncidentSeverity,
    example: IncidentSeverity.MEDIUM,
  })
  @Column({
    type: 'enum',
    enum: IncidentSeverity,
  })
  severity: IncidentSeverity;

  @ApiProperty({
    description: 'Incident description',
    example: 'Failed login attempts from unknown IP',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'Reported date',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Column({ type: 'timestamp with time zone' })
  reportedDate: Date;

  @ApiProperty({
    description: 'Resolved date',
    example: '2024-01-15T12:00:00.000Z',
    required: false,
  })
  @Column({ type: 'timestamp with time zone', nullable: true })
  resolvedDate?: Date;

  @ApiProperty({
    description: 'Incident status',
    enum: IncidentStatus,
    example: IncidentStatus.RESOLVED,
  })
  @Column({
    type: 'enum',
    enum: IncidentStatus,
  })
  status: IncidentStatus;

  @ApiProperty({
    description: 'Number of affected users',
    example: 0,
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  affectedUsers?: number;

  @ApiProperty({
    description: 'Actions taken',
    example: ['IP blocked', 'User notified'],
  })
  @Column({ type: 'text', array: true, default: '{}' })
  actionsTaken: string[];

  @ManyToOne(() => SecuritySettings, (settings) => settings.securityIncidents)
  securitySettings: SecuritySettings;
}
