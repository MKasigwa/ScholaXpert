import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsDateString,
  IsUUID,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import type { SchoolYearStatus } from '../entities/school-year.entity';

export type SchoolYearSortField =
  | 'name'
  | 'code'
  | 'startDate'
  | 'endDate'
  | 'status'
  | 'isDefault'
  | 'createdAt'
  | 'updatedAt';

export class SchoolYearQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Tenant ID filter',
    type: String,
  })
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiPropertyOptional({
    description: 'Search by name, code, or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: ['draft', 'active', 'archived'],
  })
  @IsOptional()
  @IsEnum(['draft', 'active', 'archived'], {
    message: 'Status must be one of: draft, active, archived',
  })
  status?: SchoolYearStatus;

  @ApiPropertyOptional({
    description: 'Filter by default status',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: 'Include soft-deleted school years',
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeDeleted?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by start date from',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  startDateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter by start date to',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  startDateTo?: string;

  @ApiPropertyOptional({
    description: 'Filter by end date from',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  endDateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter by end date to',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  endDateTo?: string;

  @ApiPropertyOptional({
    description: 'Filter by creator',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'Filter by updater',
  })
  @IsOptional()
  @IsString()
  updatedBy?: string;

  @ApiPropertyOptional({
    description: 'Filter by enrollment status',
    enum: ['open', 'closed', 'pending'],
  })
  @IsOptional()
  @IsEnum(['open', 'closed', 'pending'])
  enrollmentStatus?: 'open' | 'closed' | 'pending';

  @ApiPropertyOptional({
    description: 'Filter by academic calendar status',
    enum: ['complete', 'incomplete', 'draft'],
  })
  @IsOptional()
  @IsEnum(['complete', 'incomplete', 'draft'])
  academicCalendarStatus?: 'complete' | 'incomplete' | 'draft';

  @ApiPropertyOptional({
    description: 'Relations to include',
    isArray: true,
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  //   @Transform(({ value }) => {
  //     if (typeof value === 'string') {
  //       return value
  //         .split(',')
  //         .map((s) => s.trim())
  //         .filter(Boolean);
  //     }
  //     return Array.isArray(value) ? value : [];
  //   })
  include?: string[];

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: [
      'name',
      'code',
      'startDate',
      'endDate',
      'status',
      'isDefault',
      'createdAt',
      'updatedAt',
    ],
    default: 'startDate',
  })
  @IsOptional()
  @IsEnum([
    'name',
    'code',
    'startDate',
    'endDate',
    'status',
    'isDefault',
    'createdAt',
    'updatedAt',
  ])
  sortBy?: SchoolYearSortField = 'startDate';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
