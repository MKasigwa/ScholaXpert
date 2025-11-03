import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsDateString,
  IsUUID,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BaseQueryDto } from '../../../common/dto/base-query.dto';

export type SchoolYearStatus = 'draft' | 'active' | 'archived';
export type SchoolYearSortField =
  | 'name'
  | 'code'
  | 'startDate'
  | 'endDate'
  | 'status'
  | 'isDefault'
  | 'createdAt'
  | 'updatedAt';

export class SchoolYearQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @IsOptional()
  @IsEnum(['draft', 'active', 'archived'], {
    message: 'Status must be one of: draft, active, archived',
  })
  status?: SchoolYearStatus;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isDefault?: boolean;

  //   @IsOptional()
  //   @IsBoolean()
  //   @Transform(({ value }) => value === 'true' || value === true)
  //   includeDeleted?: boolean;

  @IsOptional()
  @IsDateString()
  startDateFrom?: string;

  @IsOptional()
  @IsDateString()
  startDateTo?: string;

  @IsOptional()
  @IsDateString()
  endDateFrom?: string;

  @IsOptional()
  @IsDateString()
  endDateTo?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsString()
  updatedBy?: string;

  @IsOptional()
  @IsEnum(['open', 'closed', 'pending'])
  enrollmentStatus?: 'open' | 'closed' | 'pending';

  @IsOptional()
  @IsEnum(['complete', 'incomplete', 'draft'])
  academicCalendarStatus?: 'complete' | 'incomplete' | 'draft';

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

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
