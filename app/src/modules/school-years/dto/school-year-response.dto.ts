import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SchoolYear } from '../entities/school-year.entity';

export class SchoolYearResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  tenantId: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  //   @Transform(({ value }) => (value ? value.toISOString().split('T')[0] : null))
  startDate: string;

  @ApiProperty()
  @Expose()
  //   @Transform(({ value }) => (value ? value.toISOString().split('T')[0] : null))
  endDate: string;

  @ApiProperty({ enum: ['draft', 'active', 'archived'] })
  @Expose()
  status: 'draft' | 'active' | 'archived';

  @ApiProperty()
  @Expose()
  isDefault: boolean;

  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiPropertyOptional()
  @Expose()
  //   @Transform(({ value }) => (value ? value.toISOString().split('T')[0] : null))
  enrollmentStartDate?: string;

  @ApiPropertyOptional()
  @Expose()
  //   @Transform(({ value }) => (value ? value.toISOString().split('T')[0] : null))
  enrollmentEndDate?: string;

  @ApiPropertyOptional()
  @Expose()
  //   @Transform(({ value }) => (value ? value.toISOString().split('T')[0] : null))
  gradeSubmissionDeadline?: string;

  @ApiPropertyOptional()
  @Expose()
  //   @Transform(({ value }) => (value ? value.toISOString().split('T')[0] : null))
  graduationDate?: string;

  @ApiProperty()
  @Expose()
  studentCount: number;

  @ApiProperty()
  @Expose()
  staffCount: number;

  @ApiProperty()
  @Expose()
  classCount: number;

  @ApiProperty()
  @Expose()
  termCount: number;

  @ApiProperty({ enum: ['open', 'closed', 'pending'] })
  @Expose()
  enrollmentStatus: 'open' | 'closed' | 'pending';

  @ApiProperty({ enum: ['complete', 'incomplete', 'draft'] })
  @Expose()
  academicCalendarStatus: 'complete' | 'incomplete' | 'draft';

  @ApiProperty()
  @Expose()
  createdBy: string;

  @ApiProperty()
  @Expose()
  updatedBy: string;

  @ApiPropertyOptional()
  @Expose()
  deletedBy?: string;

  @ApiProperty()
  @Expose()
  //   @Transform(({ value }) => (value ? value.toISOString() : null))
  createdAt: string;

  @ApiProperty()
  @Expose()
  //   @Transform(({ value }) => (value ? value.toISOString() : null))
  updatedAt: string;

  @ApiPropertyOptional()
  @Expose()
  //   @Transform(({ value }) => (value ? value.toISOString() : null))
  deletedAt?: string;

  // Computed properties
  @ApiProperty({ description: 'Duration in days' })
  @Expose()
  get duration(): number {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  @ApiProperty({ description: 'Is active and not deleted' })
  @Expose()
  get isActive(): boolean {
    return this.status === 'active' && !this.deletedAt;
  }

  @ApiProperty({ description: 'Is within date range and active' })
  @Expose()
  get isCurrent(): boolean {
    const now = new Date();
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    return start <= now && now <= end && this.isActive;
  }

  /**
   * Create a response DTO from a SchoolYear entity
   */
  static fromEntity(entity: SchoolYear): SchoolYearResponseDto {
    const dto = new SchoolYearResponseDto();
    dto.id = entity.id;
    dto.tenantId = entity.tenantId;
    dto.name = entity.name;
    dto.code = entity.code;
    dto.startDate =
      entity.startDate instanceof Date
        ? entity.startDate.toISOString().split('T')[0]
        : entity.startDate;
    dto.endDate =
      entity.endDate instanceof Date
        ? entity.endDate.toISOString().split('T')[0]
        : entity.endDate;
    dto.status = entity.status;
    dto.isDefault = entity.isDefault;
    dto.description = entity.description;
    dto.enrollmentStartDate =
      entity.enrollmentStartDate instanceof Date
        ? entity.enrollmentStartDate.toISOString().split('T')[0]
        : entity.enrollmentStartDate;
    dto.enrollmentEndDate =
      entity.enrollmentEndDate instanceof Date
        ? entity.enrollmentEndDate.toISOString().split('T')[0]
        : entity.enrollmentEndDate;
    dto.gradeSubmissionDeadline =
      entity.gradeSubmissionDeadline instanceof Date
        ? entity.gradeSubmissionDeadline.toISOString().split('T')[0]
        : entity.gradeSubmissionDeadline;
    dto.graduationDate =
      entity.graduationDate instanceof Date
        ? entity.graduationDate.toISOString().split('T')[0]
        : entity.graduationDate;
    dto.studentCount = entity.studentCount;
    dto.staffCount = entity.staffCount;
    dto.classCount = entity.classCount;
    dto.termCount = entity.termCount;
    dto.enrollmentStatus = entity.enrollmentStatus;
    dto.academicCalendarStatus = entity.academicCalendarStatus;
    // dto.createdBy = entity.createdBy;
    // dto.updatedBy = entity.updatedBy;
    dto.deletedBy = entity.deletedBy;
    dto.createdAt =
      entity.createdAt instanceof Date
        ? entity.createdAt.toISOString()
        : entity.createdAt;
    dto.updatedAt =
      entity.updatedAt instanceof Date
        ? entity.updatedAt.toISOString()
        : entity.updatedAt;
    dto.deletedAt =
      entity.deletedAt instanceof Date
        ? entity.deletedAt.toISOString()
        : entity.deletedAt;
    return dto;
  }
}

export class SchoolYearStatsResponseDto {
  @ApiProperty()
  @Expose()
  totalSchoolYears: number;

  @ApiProperty()
  @Expose()
  activeSchoolYears: number;

  @ApiProperty()
  @Expose()
  draftSchoolYears: number;

  @ApiProperty()
  @Expose()
  archivedSchoolYears: number;

  @ApiProperty()
  @Expose()
  deletedSchoolYears: number;

  @ApiPropertyOptional({ type: SchoolYearResponseDto })
  @Expose()
  defaultSchoolYear?: SchoolYearResponseDto;

  @ApiProperty()
  @Expose()
  totalStudents: number;

  @ApiProperty()
  @Expose()
  totalStaff: number;

  @ApiProperty()
  @Expose()
  totalClasses: number;

  @ApiProperty()
  @Expose()
  averageDuration: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['enrollment', 'grade_submission', 'graduation'],
        },
        date: { type: 'string' },
        schoolYearName: { type: 'string' },
        daysRemaining: { type: 'number' },
      },
    },
  })
  @Expose()
  upcomingDeadlines: Array<{
    type: 'enrollment' | 'grade_submission' | 'graduation';
    date: string;
    schoolYearName: string;
    daysRemaining: number;
  }>;
}
