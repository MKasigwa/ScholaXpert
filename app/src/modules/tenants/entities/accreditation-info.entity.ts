import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { SchoolInfo } from './school-info.entity';

export enum AccreditationStatus {
  ACCREDITED = 'accredited',
  PENDING = 'pending',
  EXPIRED = 'expired',
  DENIED = 'denied',
}

@Entity('accreditation_infos')
export class AccreditationInfo extends BaseEntity {
  @ApiProperty({
    description: 'Accrediting body',
    example: 'State Board of Education',
  })
  @Column({ length: 200 })
  body: string;

  @ApiProperty({
    description: 'Accreditation status',
    enum: AccreditationStatus,
    example: AccreditationStatus.ACCREDITED,
  })
  @Column({
    type: 'enum',
    enum: AccreditationStatus,
  })
  status: AccreditationStatus;

  @ApiProperty({
    description: 'Expiry date',
    example: '2025-12-31',
    required: false,
  })
  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;

  @ApiProperty({
    description: 'Certificate number',
    example: 'ACC-2024-001',
    required: false,
  })
  @Column({ length: 100, nullable: true })
  certificateNumber?: string;

  @ManyToOne(() => SchoolInfo, (schoolInfo) => schoolInfo.accreditation)
  schoolInfo: SchoolInfo;
}
