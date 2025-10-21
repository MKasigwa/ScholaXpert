import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('contact_persons')
export class ContactPerson extends BaseEntity {
  @ApiProperty({
    description: 'Contact person name',
    example: 'John Smith',
  })
  @Column({ length: 200 })
  name: string;

  @ApiProperty({
    description: 'Contact person title',
    example: 'Principal',
  })
  @Column({ length: 100 })
  title: string;

  @ApiProperty({
    description: 'Contact person email',
    example: 'john.smith@springfield-elem.edu',
  })
  @Column({ length: 255 })
  email: string;

  @ApiProperty({
    description: 'Contact person phone',
    example: '+1-555-0123',
  })
  @Column({ length: 20 })
  phone: string;

  @ApiProperty({
    description: 'Department',
    example: 'Administration',
    required: false,
  })
  @Column({ length: 100, nullable: true })
  department?: string;
}
