import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Address } from './address.entity';

@Entity('tenant_locations')
export class TenantLocation extends BaseEntity {
  @ApiProperty({
    description: 'Timezone',
    example: 'America/Chicago',
  })
  @Column({ length: 100 })
  timezone: string;

  @ApiProperty({
    description: 'Locale',
    example: 'en_US',
  })
  @Column({ length: 10 })
  locale: string;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
  })
  @Column({ length: 3 })
  currency: string;

  @ApiProperty({
    description: 'Region',
    example: 'North America',
  })
  @Column({ length: 100 })
  region: string;

  @ApiProperty({
    description: 'Country',
    example: 'United States',
  })
  @Column({ length: 100 })
  country: string;

  @OneToOne(() => Address, { cascade: true, eager: true })
  @JoinColumn({ name: 'addressId' })
  address: Address;
}
