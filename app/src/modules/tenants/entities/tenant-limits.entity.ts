import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('tenant_limits')
export class TenantLimits extends BaseEntity {
  @ApiProperty({ description: 'Maximum users', example: 50 })
  @Column({ type: 'int', default: 10 })
  maxUsers: number;

  @ApiProperty({ description: 'Maximum students', example: 500 })
  @Column({ type: 'int', default: 100 })
  maxStudents: number;

  @ApiProperty({ description: 'Maximum staff', example: 100 })
  @Column({ type: 'int', default: 20 })
  maxStaff: number;

  @ApiProperty({ description: 'Maximum classes', example: 50 })
  @Column({ type: 'int', default: 10 })
  maxClasses: number;

  @ApiProperty({ description: 'Maximum subjects', example: 100 })
  @Column({ type: 'int', default: 20 })
  maxSubjects: number;

  @ApiProperty({ description: 'Storage quota in GB', example: 25 })
  @Column({ type: 'int', default: 5 })
  storageQuota: number;

  @ApiProperty({ description: 'Monthly API calls', example: 10000 })
  @Column({ type: 'int', default: 1000 })
  monthlyApiCalls: number;

  @ApiProperty({ description: 'Daily email limit', example: 1000 })
  @Column({ type: 'int', default: 100 })
  dailyEmailLimit: number;

  @ApiProperty({ description: 'Concurrent sessions', example: 100 })
  @Column({ type: 'int', default: 10 })
  concurrentSessions: number;
}
