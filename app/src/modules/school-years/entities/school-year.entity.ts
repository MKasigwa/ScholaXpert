import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, Index } from 'typeorm';

export type SchoolYearStatus = 'draft' | 'active' | 'archived';
export type EnrollmentStatus = 'open' | 'closed' | 'pending';
export type AcademicCalendarStatus = 'complete' | 'incomplete' | 'draft';

@Entity('school_years')
@Index(['tenantId', 'status'])
@Index(['tenantId', 'isDefault'])
@Index(['tenantId', 'startDate', 'endDate'])
export class SchoolYear extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'name', length: 100 })
  name: string;

  @Column({ name: 'code', length: 20 })
  code: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['draft', 'active', 'archived'],
    default: 'draft',
  })
  status: SchoolYearStatus;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  @Index()
  isDefault: boolean;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'enrollment_start_date', type: 'date', nullable: true })
  enrollmentStartDate?: Date;

  @Column({ name: 'enrollment_end_date', type: 'date', nullable: true })
  enrollmentEndDate?: Date;

  @Column({ name: 'grade_submission_deadline', type: 'date', nullable: true })
  gradeSubmissionDeadline?: Date;

  @Column({ name: 'graduation_date', type: 'date', nullable: true })
  graduationDate?: Date;

  // Metadata
  @Column({ name: 'student_count', type: 'int', default: 0 })
  studentCount: number;

  @Column({ name: 'staff_count', type: 'int', default: 0 })
  staffCount: number;

  @Column({ name: 'class_count', type: 'int', default: 0 })
  classCount: number;

  @Column({ name: 'term_count', type: 'int', default: 2 })
  termCount: number;

  @Column({
    name: 'enrollment_status',
    type: 'enum',
    enum: ['open', 'closed', 'pending'],
    default: 'pending',
  })
  enrollmentStatus: EnrollmentStatus;

  @Column({
    name: 'academic_calendar_status',
    type: 'enum',
    enum: ['complete', 'incomplete', 'draft'],
    default: 'draft',
  })
  academicCalendarStatus: AcademicCalendarStatus;

  // Audit fields

  @Column({ name: 'deleted_by', length: 100, nullable: true })
  deletedBy?: string;

  // Computed properties
  get duration(): number {
    return Math.ceil(
      (this.endDate.getTime() - this.startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );
  }

  get isActive(): boolean {
    return this.status === 'active' && !this.deletedAt;
  }

  get isCurrent(): boolean {
    const now = new Date();
    return this.startDate <= now && now <= this.endDate && this.isActive;
  }
}
