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

export type SchoolYearStatus = 'draft' | 'active' | 'archived';

export class CreateSchoolYearDto {
  @IsUUID()
  tenantId: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  code: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsEnum(['draft', 'active', 'archived'], {
    message: 'Status must be one of: draft, active, archived',
  })
  status?: SchoolYearStatus = 'draft';

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isDefault?: boolean = false;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsDateString()
  enrollmentStartDate?: string;

  @IsOptional()
  @IsDateString()
  enrollmentEndDate?: string;

  @IsOptional()
  @IsDateString()
  gradeSubmissionDeadline?: string;

  @IsOptional()
  @IsDateString()
  graduationDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  termCount?: number = 2;

  @IsOptional()
  @IsEnum(['open', 'closed', 'pending'])
  enrollmentStatus?: 'open' | 'closed' | 'pending' = 'pending';

  @IsOptional()
  @IsEnum(['complete', 'incomplete', 'draft'])
  academicCalendarStatus?: 'complete' | 'incomplete' | 'draft' = 'draft';

  @IsString()
  createdBy: string;
}
