import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { FeatureLimits } from './feature-limits.entity';

@Entity('subscription_limits')
export class SubscriptionLimits extends BaseEntity {
  @ApiProperty({
    description: 'Maximum users',
    example: 100,
  })
  @Column({ type: 'int' })
  maxUsers: number;

  @ApiProperty({
    description: 'Maximum students',
    example: 500,
  })
  @Column({ type: 'int' })
  maxStudents: number;

  @ApiProperty({
    description: 'Maximum storage in GB',
    example: 50,
  })
  @Column({ type: 'int' })
  maxStorage: number;

  @ApiProperty({
    description: 'Maximum API calls per month',
    example: 10000,
  })
  @Column({ type: 'int' })
  maxApiCalls: number;

  @ApiProperty({
    description: 'Maximum school years',
    example: 5,
  })
  @Column({ type: 'int' })
  maxSchoolYears: number;

  @ApiProperty({
    description: 'Maximum classes',
    example: 50,
  })
  @Column({ type: 'int' })
  maxClasses: number;

  @OneToOne(() => FeatureLimits, { cascade: true, eager: true })
  @JoinColumn({ name: 'featuresId' })
  features: FeatureLimits;
}
