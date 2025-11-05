import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ComplianceCertification } from './compliance-certification.entity';
import { ContactPerson } from './contact-person.entity';

@Entity('compliance_infos')
export class ComplianceInfo extends BaseEntity {
  @ApiProperty({ description: 'GDPR compliant', example: true })
  @Column({ type: 'boolean', default: false })
  gdprCompliant: boolean;

  @ApiProperty({ description: 'COPPA compliant', example: true })
  @Column({ type: 'boolean', default: false })
  coppaCompliant: boolean;

  @ApiProperty({ description: 'FERPA compliant', example: true })
  @Column({ type: 'boolean', default: false })
  ferpaCompliant: boolean;

  @ApiProperty({ description: 'HIPAA compliant', example: false })
  @Column({ type: 'boolean', default: false })
  hipaaCompliant: boolean;

  @ApiProperty({
    description: 'Local regulations',
    example: ['STATE_EDU_REG_001'],
  })
  @Column({ type: 'text', array: true, default: '{}' })
  localRegulations: string[];

  @ApiProperty({ description: 'Data processing addendum', example: true })
  @Column({ type: 'boolean', default: false })
  dataProcessingAddendum: boolean;

  @ApiProperty({ description: 'Data retention policy', example: '7 years' })
  @Column({ length: 500, default: 'As per institutional policy' })
  dataRetentionPolicy: string;

  @ApiProperty({ description: 'Right to erasure enabled', example: true })
  @Column({ type: 'boolean', default: false })
  rightToErasure: boolean;

  @ApiProperty({ description: 'Data portability enabled', example: true })
  @Column({ type: 'boolean', default: false })
  dataPortability: boolean;

  @OneToOne(() => ContactPerson, { cascade: true, eager: true, nullable: true })
  @JoinColumn({ name: 'complianceOfficerId' })
  complianceOfficer?: ContactPerson;

  @OneToMany(() => ComplianceCertification, (cert) => cert.complianceInfo, {
    cascade: true,
    eager: true,
  })
  certifications: ComplianceCertification[];
}
