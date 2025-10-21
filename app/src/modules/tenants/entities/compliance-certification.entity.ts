import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ComplianceInfo } from './compliance-info.entity';

export enum CertificationStatus {
  VALID = 'valid',
  EXPIRED = 'expired',
  PENDING = 'pending',
  REVOKED = 'revoked',
}

@Entity('compliance_certifications')
export class ComplianceCertification extends BaseEntity {
  @ApiProperty({ description: 'Certification name', example: 'ISO 27001' })
  @Column({ length: 200 })
  name: string;

  @ApiProperty({ description: 'Issued by', example: 'BSI Group' })
  @Column({ length: 200 })
  issuedBy: string;

  @ApiProperty({ description: 'Issue date', example: '2024-01-01' })
  @Column({ type: 'date' })
  issuedDate: Date;

  @ApiProperty({
    description: 'Expiry date',
    example: '2027-01-01',
    required: false,
  })
  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;

  @ApiProperty({ description: 'Certificate ID', example: 'CERT-2024-001' })
  @Column({ length: 100 })
  certificateId: string;

  @ApiProperty({
    description: 'Certification status',
    enum: CertificationStatus,
    example: CertificationStatus.VALID,
  })
  @Column({
    type: 'enum',
    enum: CertificationStatus,
  })
  status: CertificationStatus;

  @ManyToOne(() => ComplianceInfo, (info) => info.certifications)
  complianceInfo: ComplianceInfo;
}
