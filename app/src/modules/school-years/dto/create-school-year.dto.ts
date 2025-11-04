import {
  IsString,
  IsDateString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsInt,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { SchoolYearStatus } from '../entities/school-year.entity';

export class CreateSchoolYearDto {
  @ApiProperty({
    description: 'Tenant ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  tenantId: string;

  @ApiProperty({
    description: 'School year name',
    example: '2024-2025 Academic Year',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Short code for the school year',
    example: '2024-25',
    minLength: 2,
    maxLength: 20,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  code: string;

  @ApiProperty({
    description: 'Start date (ISO 8601 format)',
    example: '2024-09-01',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'End date (ISO 8601 format)',
    example: '2025-06-30',
  })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({
    description: 'School year status',
    enum: ['draft', 'active', 'archived'],
    default: 'draft',
  })
  @IsOptional()
  @IsEnum(['draft', 'active', 'archived'], {
    message: 'Status must be one of: draft, active, archived',
  })
  status?: SchoolYearStatus = 'draft';

  @ApiPropertyOptional({
    description: 'Whether this is the default school year',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isDefault?: boolean = false;

  @ApiPropertyOptional({
    description: 'Description or notes',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Enrollment start date',
    example: '2024-06-01',
  })
  @IsOptional()
  @IsDateString()
  enrollmentStartDate?: string;

  @ApiPropertyOptional({
    description: 'Enrollment end date',
    example: '2024-08-31',
  })
  @IsOptional()
  @IsDateString()
  enrollmentEndDate?: string;

  @ApiPropertyOptional({
    description: 'Grade submission deadline',
    example: '2025-07-15',
  })
  @IsOptional()
  @IsDateString()
  gradeSubmissionDeadline?: string;

  @ApiPropertyOptional({
    description: 'Graduation date',
    example: '2025-06-15',
  })
  @IsOptional()
  @IsDateString()
  graduationDate?: string;

  @ApiPropertyOptional({
    description: 'Number of terms',
    default: 2,
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  termCount?: number = 2;

  @ApiPropertyOptional({
    description: 'Enrollment status',
    enum: ['open', 'closed', 'pending'],
    default: 'pending',
  })
  @IsOptional()
  @IsEnum(['open', 'closed', 'pending'])
  enrollmentStatus?: 'open' | 'closed' | 'pending' = 'pending';

  @ApiPropertyOptional({
    description: 'Academic calendar status',
    enum: ['complete', 'incomplete', 'draft'],
    default: 'draft',
  })
  @IsOptional()
  @IsEnum(['complete', 'incomplete', 'draft'])
  academicCalendarStatus?: 'complete' | 'incomplete' | 'draft' = 'draft';

  @ApiProperty({
    description: 'User who created this school year',
    example: 'admin@school.com',
  })
  @IsString()
  createdBy: string;
}
