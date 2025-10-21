import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('tenant_usage')
export class TenantUsage extends BaseEntity {
  @ApiProperty({ description: 'Total users', example: 45 })
  @Column({ type: 'int', default: 0 })
  totalUsers: number;

  @ApiProperty({ description: 'Active users', example: 42 })
  @Column({ type: 'int', default: 0 })
  activeUsers: number;

  @ApiProperty({ description: 'Last month active users', example: 38 })
  @Column({ type: 'int', default: 0 })
  lastMonthActiveUsers: number;

  @ApiProperty({ description: 'Total students', example: 425 })
  @Column({ type: 'int', default: 0 })
  totalStudents: number;

  @ApiProperty({ description: 'Active students', example: 420 })
  @Column({ type: 'int', default: 0 })
  activeStudents: number;

  @ApiProperty({ description: 'Storage used in GB', example: 15.5 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  storageUsed: number;

  @ApiProperty({ description: 'API calls this month', example: 8500 })
  @Column({ type: 'int', default: 0 })
  apiCallsThisMonth: number;

  @ApiProperty({ description: 'Bandwidth used in GB', example: 5.2 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  bandwidthUsed: number;

  @ApiProperty({ description: 'Feature usage statistics' })
  @Column({ type: 'jsonb', default: '{}' })
  featureUsage: Record<string, number>;

  @ApiProperty({ description: 'Average response time in ms', example: 250 })
  @Column({ type: 'int', default: 0 })
  averageResponseTime: number;

  @ApiProperty({ description: 'Uptime percentage', example: 99.9 })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 })
  uptime: number;

  @ApiProperty({ description: 'Error rate percentage', example: 0.1 })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  errorRate: number;

  @ApiProperty({ description: 'Monthly growth rate percentage', example: 5.2 })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  monthlyGrowthRate: number;

  @ApiProperty({ description: 'Retention rate percentage', example: 92.5 })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  retentionRate: number;

  @ApiProperty({ description: 'Churn risk score (0-100)', example: 15 })
  @Column({ type: 'int', default: 0 })
  churnRisk: number;
}
