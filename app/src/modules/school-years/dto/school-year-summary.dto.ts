import { ApiProperty } from '@nestjs/swagger';
import {
  Expose,
  //  Transform
} from 'class-transformer';
import { SchoolYear } from '../entities/school-year.entity';

/**
 * Lightweight DTO for School Year summaries
 * Used in dropdowns, selectors, and list views where full details aren't needed
 */
export class SchoolYearSummaryDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Tenant ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @Expose()
  tenantId: string;

  @ApiProperty({
    description: 'School year name',
    example: '2024-2025 Academic Year',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Short code for the school year',
    example: '2024-25',
  })
  @Expose()
  code: string;

  @ApiProperty({
    description: 'Start date',
    example: '2024-09-01',
  })
  @Expose()
  //   @Transform(({ value }) => (value ? value.toISOString().split('T')[0] : null))
  startDate: string;

  @ApiProperty({
    description: 'End date',
    example: '2025-06-30',
  })
  @Expose()
  //   @Transform(({ value }) => (value ? value.toISOString().split('T')[0] : null))
  endDate: string;

  @ApiProperty({
    description: 'School year status',
    enum: ['draft', 'active', 'archived'],
    example: 'active',
  })
  @Expose()
  status: 'draft' | 'active' | 'archived';

  @ApiProperty({
    description: 'Whether this is the default school year',
    example: true,
  })
  @Expose()
  isDefault: boolean;

  @ApiProperty({
    description: 'Whether the school year is currently active',
    example: true,
  })
  @Expose()
  get isActive(): boolean {
    return this.status === 'active';
  }

  @ApiProperty({
    description: 'Whether the school year is current (within date range)',
    example: true,
  })
  @Expose()
  get isCurrent(): boolean {
    const now = new Date();
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    return start <= now && now <= end && this.isActive;
  }

  /**
   * Create a summary DTO from a SchoolYear entity
   */
  static fromEntity(entity: SchoolYear): SchoolYearSummaryDto {
    const dto = new SchoolYearSummaryDto();
    dto.id = entity.id;
    dto.tenantId = entity.tenantId;
    dto.name = entity.name;
    dto.code = entity.code;
    dto.startDate = entity.startDate.toISOString().split('T')[0];
    dto.endDate = entity.endDate.toISOString().split('T')[0];
    dto.status = entity.status;
    dto.isDefault = entity.isDefault;
    return dto;
  }
}
