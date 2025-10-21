import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContactPerson } from './contact-person.entity';
import { Address } from './address.entity';

@Entity('tenant_contact_info')
export class TenantContactInfo extends BaseEntity {
  @ApiProperty({
    description: 'Primary contact phone number',
    example: '+1-555-0123',
  })
  @Column({ length: 20 })
  phone: string;

  @ApiProperty({
    description: 'Primary contact email',
    example: 'admin@springfield-elem.edu',
  })
  @Column({ length: 255 })
  email: string;

  @ApiProperty({
    description: 'Website URL',
    example: 'https://springfield-elem.edu',
    required: false,
  })
  @Column({ length: 255, nullable: true })
  website?: string;

  // Relationships
  @OneToOne(() => ContactPerson, { cascade: true, eager: true })
  @JoinColumn({ name: 'primaryContactId' })
  primaryContact: ContactPerson;

  @OneToOne(() => ContactPerson, { cascade: true, eager: true, nullable: true })
  @JoinColumn({ name: 'billingContactId' })
  billingContact?: ContactPerson;

  @OneToOne(() => ContactPerson, { cascade: true, eager: true, nullable: true })
  @JoinColumn({ name: 'technicalContactId' })
  technicalContact?: ContactPerson;

  @OneToOne(() => ContactPerson, { cascade: true, eager: true, nullable: true })
  @JoinColumn({ name: 'emergencyContactId' })
  emergencyContact?: ContactPerson;

  @OneToOne(() => Address, { cascade: true, eager: true })
  @JoinColumn({ name: 'addressId' })
  address: Address;
}
