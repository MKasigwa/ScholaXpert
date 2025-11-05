import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('addresses')
export class Address extends BaseEntity {
  @ApiProperty({
    description: 'Street address line 1',
    example: '123 Main Street',
  })
  @Column({ length: 255 })
  street1: string;

  @ApiProperty({
    description: 'Street address line 2',
    example: 'Suite 100',
    required: false,
  })
  @Column({ length: 255, nullable: true })
  street2?: string;

  @ApiProperty({
    description: 'City',
    example: 'Springfield',
  })
  @Column({ length: 100 })
  city: string;

  @ApiProperty({
    description: 'State or province',
    example: 'Illinois',
  })
  @Column({ length: 100 })
  state: string;

  @ApiProperty({
    description: 'Postal or ZIP code',
    example: '62704',
  })
  @Column({ length: 20 })
  postalCode: string;

  @ApiProperty({
    description: 'Country',
    example: 'United States',
  })
  @Column({ length: 100 })
  country: string;

  @ApiProperty({
    description: 'Latitude coordinate',
    example: 39.7817,
    required: false,
  })
  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: -89.6501,
    required: false,
  })
  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;
}
