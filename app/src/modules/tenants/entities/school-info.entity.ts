import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AccreditationInfo } from './accreditation-info.entity';

export enum SchoolType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  CHARTER = 'charter',
  INTERNATIONAL = 'international',
  RELIGIOUS = 'religious',
  MONTESSORI = 'montessori',
  WALDORF = 'waldorf',
  ONLINE = 'online',
  VOCATIONAL = 'vocational',
}

export enum SchoolCategory {
  ELEMENTARY = 'elementary',
  MIDDLE = 'middle',
  HIGH = 'high',
  K12 = 'k12',
  PRESCHOOL = 'preschool',
  UNIVERSITY = 'university',
  VOCATIONAL = 'vocational',
}

export enum EducationLevel {
  PRESCHOOL = 'preschool',
  KINDERGARTEN = 'kindergarten',
  ELEMENTARY = 'elementary',
  MIDDLE = 'middle',
  HIGH = 'high',
  COLLEGE_PREP = 'college_prep',
  VOCATIONAL = 'vocational',
  ADULT_EDUCATION = 'adult_education',
}

export enum AcademicCalendarType {
  SEMESTER = 'semester',
  TRIMESTER = 'trimester',
  QUARTER = 'quarter',
  YEAR_ROUND = 'year_round',
}

@Entity('school_infos')
export class SchoolInfo extends BaseEntity {
  @ApiProperty({
    description: 'School type',
    enum: SchoolType,
    example: SchoolType.PUBLIC,
  })
  @Column({
    type: 'enum',
    enum: SchoolType,
  })
  type: SchoolType;

  @ApiProperty({
    description: 'School category',
    enum: SchoolCategory,
    example: SchoolCategory.ELEMENTARY,
  })
  @Column({
    type: 'enum',
    enum: SchoolCategory,
  })
  category: SchoolCategory;

  @ApiProperty({
    description: 'Education levels offered',
    enum: EducationLevel,
    isArray: true,
    example: [EducationLevel.KINDERGARTEN, EducationLevel.ELEMENTARY],
  })
  @Column({
    type: 'enum',
    enum: EducationLevel,
    array: true,
  })
  levels: EducationLevel[];

  @ApiProperty({
    description: 'Year the school was founded',
    example: 1985,
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  foundedYear?: number;

  @ApiProperty({
    description: 'Principal name',
    example: 'John Smith',
    required: false,
  })
  @Column({ length: 200, nullable: true })
  principalName?: string;

  @ApiProperty({
    description: 'Student capacity',
    example: 500,
  })
  @Column({ type: 'int' })
  studentCapacity: number;

  @ApiProperty({
    description: 'Current enrollment',
    example: 425,
  })
  @Column({ type: 'int', default: 0 })
  currentEnrollment: number;

  @ApiProperty({
    description: 'Staff count',
    example: 45,
  })
  @Column({ type: 'int', default: 0 })
  staffCount: number;

  @ApiProperty({
    description: 'Academic calendar type',
    enum: AcademicCalendarType,
    example: AcademicCalendarType.SEMESTER,
  })
  @Column({
    type: 'enum',
    enum: AcademicCalendarType,
  })
  academicCalendar: AcademicCalendarType;

  @ApiProperty({
    description: 'Languages offered',
    example: ['English', 'Spanish', 'French'],
  })
  @Column({ type: 'text', array: true, default: '{}' })
  languagesOffered: string[];

  @ApiProperty({
    description: 'Special programs',
    example: ['STEM', 'Arts', 'Sports'],
    required: false,
  })
  @Column({ type: 'text', array: true, nullable: true })
  specialPrograms?: string[];

  @OneToMany(
    () => AccreditationInfo,
    (accreditation) => accreditation.schoolInfo,
    {
      cascade: true,
      eager: true,
    },
  )
  accreditation: AccreditationInfo[];
}
