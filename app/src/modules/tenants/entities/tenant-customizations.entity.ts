import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('tenant_customizations')
export class TenantCustomizations extends BaseEntity {
  @ApiProperty({ description: 'Allow custom fields', example: false })
  @Column({ type: 'boolean', default: false })
  allowCustomFields: boolean;

  @ApiProperty({ description: 'Custom fields limit', example: 10 })
  @Column({ type: 'int', default: 0 })
  customFieldsLimit: number;

  @ApiProperty({ description: 'Allow workflow customization', example: false })
  @Column({ type: 'boolean', default: false })
  allowWorkflowCustomization: boolean;

  @ApiProperty({ description: 'Allow report customization', example: false })
  @Column({ type: 'boolean', default: false })
  allowReportCustomization: boolean;

  @ApiProperty({ description: 'Allow UI customization', example: false })
  @Column({ type: 'boolean', default: false })
  allowUICustomization: boolean;

  @ApiProperty({
    description: 'Custom modules',
    example: ['attendance_tracking'],
  })
  @Column({ type: 'text', array: true, default: '{}' })
  customModules: string[];
}
