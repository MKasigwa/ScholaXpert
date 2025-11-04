import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DataSource,
  SelectQueryBuilder,
  IsNull,
  FindOneOptions,
  QueryRunner,
} from 'typeorm';
import { SchoolYear, SchoolYearStatus } from './entities/school-year.entity';
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';
import { SchoolYearQueryDto } from './dto/school-year-query.dto';
import {
  SchoolYearResponseDto,
  SchoolYearStatsResponseDto,
} from './dto/school-year-response.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

@Injectable()
export class SchoolYearsService {
  constructor(
    @InjectRepository(SchoolYear)
    private readonly schoolYearRepository: Repository<SchoolYear>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Create a new school year
   */
  async create(
    createDto: CreateSchoolYearDto,
    createdBy: string,
  ): Promise<SchoolYear> {
    // Validate dates
    this.validateDates(createDto.startDate, createDto.endDate);

    // Check for unique code within tenant
    await this.validateUniqueCode(createDto.code, createDto.tenantId);

    // Check for overlapping date ranges if needed
    await this.checkDateOverlap(
      createDto.tenantId,
      new Date(createDto.startDate),
      new Date(createDto.endDate),
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // If this is being set as default, unset any existing default
      if (createDto.isDefault) {
        await this.unsetDefaultForTenant(createDto.tenantId, queryRunner);
      }

      // Create the school year
      const schoolYear = this.schoolYearRepository.create({
        ...createDto,
        startDate: new Date(createDto.startDate),
        endDate: new Date(createDto.endDate),
        enrollmentStartDate: createDto.enrollmentStartDate
          ? new Date(createDto.enrollmentStartDate)
          : undefined,
        enrollmentEndDate: createDto.enrollmentEndDate
          ? new Date(createDto.enrollmentEndDate)
          : undefined,
        gradeSubmissionDeadline: createDto.gradeSubmissionDeadline
          ? new Date(createDto.gradeSubmissionDeadline)
          : undefined,
        graduationDate: createDto.graduationDate
          ? new Date(createDto.graduationDate)
          : undefined,
        updatedBy: createdBy, // Initially same as createdBy
      });

      const saved = await queryRunner.manager.save(SchoolYear, schoolYear);
      await queryRunner.commitTransaction();

      return this.findOne(saved.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to create school year: ${error}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Find all school years with filtering, pagination, and sorting
   */
  async findAll(
    query: SchoolYearQueryDto,
  ): Promise<PaginatedResponseDto<SchoolYear>> {
    const queryBuilder =
      this.schoolYearRepository.createQueryBuilder('schoolYear');

    // Apply filters
    this.applyFilters(queryBuilder, query);

    // Apply search
    if (query.search) {
      queryBuilder.andWhere(
        '(schoolYear.name ILIKE :search OR schoolYear.code ILIKE :search OR schoolYear.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    // Apply sorting
    const sortField = `schoolYear.${query.sortBy}`;
    queryBuilder.orderBy(sortField, query.sortOrder);

    // Get total count
    const total = await queryBuilder.getCount();
    const page = query.page || 1;
    const limit = query.limit || 10;

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(query.limit);

    const schoolYears = await queryBuilder.getMany();

    return new PaginatedResponseDto(schoolYears, total, page, limit);
  }

  /**
   * Find a school year by ID
   */
  async findOne(id: string, includeDeleted?: boolean): Promise<SchoolYear> {
    const options: FindOneOptions<SchoolYear> = { where: { id } };

    if (includeDeleted) {
      options.withDeleted = true;
    }

    const schoolYear = await this.schoolYearRepository.findOne(options);

    if (!schoolYear) {
      throw new NotFoundException(`School year with ID ${id} not found`);
    }

    return schoolYear;
  }

  /**
   * Find school years by tenant
   */
  async findByTenant(tenantId: string): Promise<SchoolYear[]> {
    return this.schoolYearRepository.find({
      where: { tenantId },
      order: { startDate: 'DESC' },
    });
  }

  /**
   * Find a school year by code and tenant
   */
  async findByCode(code: string, tenantId: string): Promise<SchoolYear> {
    const schoolYear = await this.schoolYearRepository.findOne({
      where: { code, tenantId },
    });

    if (!schoolYear) {
      throw new NotFoundException(
        `School year with code ${code} not found for tenant ${tenantId}`,
      );
    }

    return schoolYear;
  }

  /**
   * Find the current active school year for a tenant
   */
  async findCurrent(tenantId: string): Promise<SchoolYear> {
    const now = new Date();

    const schoolYear = await this.schoolYearRepository
      .createQueryBuilder('schoolYear')
      .where('schoolYear.tenantId = :tenantId', { tenantId })
      .andWhere('schoolYear.status = :status', { status: 'active' })
      .andWhere('schoolYear.startDate <= :now', { now })
      .andWhere('schoolYear.endDate >= :now', { now })
      .andWhere('schoolYear.deletedAt IS NULL')
      .getOne();

    if (!schoolYear) {
      throw new NotFoundException(
        `No current school year found for tenant ${tenantId}`,
      );
    }

    return schoolYear;
  }

  /**
   * Find the default school year for a tenant
   */
  async findDefault(tenantId: string): Promise<SchoolYear> {
    const schoolYear = await this.schoolYearRepository.findOne({
      where: {
        tenantId,
        isDefault: true,
        deletedAt: IsNull(),
      },
    });

    if (!schoolYear) {
      throw new NotFoundException(
        `No default school year found for tenant ${tenantId}`,
      );
    }

    return schoolYear;
  }

  /**
   * Update a school year
   */
  async update(
    id: string,
    updateDto: UpdateSchoolYearDto,
  ): Promise<SchoolYear> {
    const schoolYear = await this.findOne(id);

    // Validate dates if being updated
    if (updateDto.startDate || updateDto.endDate) {
      const startDate = updateDto.startDate
        ? new Date(updateDto.startDate)
        : schoolYear.startDate;
      const endDate = updateDto.endDate
        ? new Date(updateDto.endDate)
        : schoolYear.endDate;
      this.validateDates(startDate.toISOString(), endDate.toISOString());

      // Check for overlapping date ranges
      await this.checkDateOverlap(schoolYear.tenantId, startDate, endDate, id);
    }

    // Check for unique code if being updated
    if (updateDto.code && updateDto.code !== schoolYear.code) {
      await this.validateUniqueCode(updateDto.code, schoolYear.tenantId, id);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // If this is being set as default, unset any existing default
      if (updateDto.isDefault && !schoolYear.isDefault) {
        await this.unsetDefaultForTenant(schoolYear.tenantId, queryRunner, id);
      }

      // Update the school year
      Object.assign(schoolYear, {
        ...updateDto,
        startDate: updateDto.startDate
          ? new Date(updateDto.startDate)
          : schoolYear.startDate,
        endDate: updateDto.endDate
          ? new Date(updateDto.endDate)
          : schoolYear.endDate,
        enrollmentStartDate: updateDto.enrollmentStartDate
          ? new Date(updateDto.enrollmentStartDate)
          : schoolYear.enrollmentStartDate,
        enrollmentEndDate: updateDto.enrollmentEndDate
          ? new Date(updateDto.enrollmentEndDate)
          : schoolYear.enrollmentEndDate,
        gradeSubmissionDeadline: updateDto.gradeSubmissionDeadline
          ? new Date(updateDto.gradeSubmissionDeadline)
          : schoolYear.gradeSubmissionDeadline,
        graduationDate: updateDto.graduationDate
          ? new Date(updateDto.graduationDate)
          : schoolYear.graduationDate,
      });

      const saved = await queryRunner.manager.save(SchoolYear, schoolYear);
      await queryRunner.commitTransaction();

      return this.findOne(saved.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to update school year: ${error}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Set a school year as default
   */
  async setAsDefault(id: string): Promise<SchoolYear> {
    const schoolYear = await this.findOne(id);

    if (schoolYear.isDefault) {
      return schoolYear;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Unset existing default
      await this.unsetDefaultForTenant(schoolYear.tenantId, queryRunner, id);

      // Set this as default
      schoolYear.isDefault = true;
      const saved = await queryRunner.manager.save(SchoolYear, schoolYear);

      await queryRunner.commitTransaction();

      return this.findOne(saved.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to set default school year: ${error}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Toggle school year status
   */
  async toggleStatus(id: string): Promise<SchoolYear> {
    const schoolYear = await this.findOne(id);

    // Toggle status: draft -> active -> archived -> draft
    if (schoolYear.status === 'draft') {
      schoolYear.status = 'active';
    } else if (schoolYear.status === 'active') {
      schoolYear.status = 'archived';
    } else {
      schoolYear.status = 'draft';
    }

    return this.schoolYearRepository.save(schoolYear);
  }

  /**
   * Activate a school year
   */
  async activate(id: string): Promise<SchoolYear> {
    const schoolYear = await this.findOne(id);
    schoolYear.status = 'active';
    return this.schoolYearRepository.save(schoolYear);
  }

  /**
   * Archive a school year
   */
  async archive(id: string): Promise<SchoolYear> {
    const schoolYear = await this.findOne(id);
    schoolYear.status = 'archived';
    return this.schoolYearRepository.save(schoolYear);
  }

  /**
   * Soft delete a school year
   */
  async remove(id: string): Promise<void> {
    const schoolYear = await this.findOne(id);

    // Prevent deletion of default or active school year
    if (schoolYear.isDefault) {
      throw new BadRequestException('Cannot delete the default school year');
    }

    if (schoolYear.status === 'active') {
      throw new BadRequestException('Cannot delete an active school year');
    }

    await this.schoolYearRepository.softDelete(id);
  }

  /**
   * Restore a soft-deleted school year
   */
  async restore(id: string): Promise<SchoolYear> {
    await this.schoolYearRepository.restore(id);
    return this.findOne(id);
  }

  /**
   * Permanently delete a school year
   */
  async permanentDelete(id: string): Promise<void> {
    const schoolYear = await this.schoolYearRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!schoolYear) {
      throw new NotFoundException(`School year with ID ${id} not found`);
    }

    // Check if there's associated data
    if (
      schoolYear.studentCount > 0 ||
      schoolYear.staffCount > 0 ||
      schoolYear.classCount > 0
    ) {
      throw new BadRequestException(
        'Cannot permanently delete school year with associated data',
      );
    }

    await this.schoolYearRepository.remove(schoolYear);
  }

  /**
   * Bulk update status for multiple school years
   */
  async bulkUpdateStatus(
    ids: string[],
    status: SchoolYearStatus,
    updatedBy: string,
  ): Promise<void> {
    await this.schoolYearRepository
      .createQueryBuilder()
      .update(SchoolYear)
      .set({ status, updatedBy })
      .whereInIds(ids)
      .execute();
  }

  /**
   * Bulk delete multiple school years
   */
  async bulkDelete(
    ids: string[],
    // , deletedBy: string
  ): Promise<void> {
    // Check for default or active school years
    const schoolYears = await this.schoolYearRepository
      .createQueryBuilder('schoolYear')
      .whereInIds(ids)
      .getMany();

    const defaultOrActive = schoolYears.filter(
      (sy) => sy.isDefault || sy.status === 'active',
    );

    if (defaultOrActive.length > 0) {
      throw new BadRequestException(
        'Cannot delete default or active school years. Please change their status first.',
      );
    }

    // Soft delete
    await this.schoolYearRepository.softDelete(ids);
  }

  /**
   * Get comprehensive statistics
   */
  async getStatistics(tenantId?: string): Promise<SchoolYearStatsResponseDto> {
    const queryBuilder =
      this.schoolYearRepository.createQueryBuilder('schoolYear');

    if (tenantId) {
      queryBuilder.where('schoolYear.tenantId = :tenantId', { tenantId });
    }

    const [
      total,
      active,
      draft,
      archived,
      deleted,
      defaultSchoolYear,
      totalStudents,
      totalStaff,
      totalClasses,
      avgDuration,
      upcomingDeadlines,
    ] = await Promise.all([
      // Total count
      queryBuilder.getCount(),

      // By status
      queryBuilder
        .clone()
        .andWhere('schoolYear.status = :status', { status: 'active' })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere('schoolYear.status = :status', { status: 'draft' })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere('schoolYear.status = :status', { status: 'archived' })
        .getCount(),

      // Deleted count
      queryBuilder
        .clone()
        .withDeleted()
        .andWhere('schoolYear.deletedAt IS NOT NULL')
        .getCount(),

      // Default school year
      queryBuilder
        .clone()
        .andWhere('schoolYear.isDefault = :isDefault', { isDefault: true })
        .getOne(),

      // Sum of students
      queryBuilder
        .clone()
        .select('SUM(schoolYear.studentCount)', 'sum')
        .getRawOne()
        .then(
          ({ result }: { result: { sum: string } }) =>
            parseInt(result.sum) || 0,
        ),

      // Sum of staff
      queryBuilder
        .clone()
        .select('SUM(schoolYear.staffCount)', 'sum')
        .getRawOne()
        .then(
          ({ result }: { result: { sum: string } }) =>
            parseInt(result.sum) || 0,
        ),

      // Sum of classes
      queryBuilder
        .clone()
        .select('SUM(schoolYear.classCount)', 'sum')
        .getRawOne()
        .then(
          ({ result }: { result: { sum: string } }) =>
            parseInt(result.sum) || 0,
        ),

      // Average duration
      queryBuilder
        .clone()
        .select(
          'AVG(EXTRACT(DAY FROM (schoolYear.endDate - schoolYear.startDate)))',
          'avg',
        )
        .getRawOne()
        .then(
          ({ result }: { result: { avg: string } }) =>
            Math.round(parseFloat(result.avg)) || 0,
        ),

      // Upcoming deadlines
      this.getUpcomingDeadlines(tenantId),
    ]);

    return {
      totalSchoolYears: total,
      activeSchoolYears: active,
      draftSchoolYears: draft,
      archivedSchoolYears: archived,
      deletedSchoolYears: deleted,
      defaultSchoolYear: defaultSchoolYear
        ? SchoolYearResponseDto.fromEntity(defaultSchoolYear)
        : undefined,
      totalStudents,
      totalStaff,
      totalClasses,
      averageDuration: avgDuration,
      upcomingDeadlines,
    };
  }

  // Private helper methods

  /**
   * Validate that start date is before end date
   */
  private validateDates(startDate: string, endDate: string): void {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Ensure school year is not too short (at least 30 days)
    const daysDiff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysDiff < 30) {
      throw new BadRequestException(
        'School year must be at least 30 days long',
      );
    }

    // Ensure school year is not too long (max 500 days)
    if (daysDiff > 500) {
      throw new BadRequestException('School year cannot exceed 500 days');
    }
  }

  /**
   * Validate unique code within tenant
   */
  private async validateUniqueCode(
    code: string,
    tenantId: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.schoolYearRepository.findOne({
      where: { code, tenantId },
    });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException(
        `School year with code ${code} already exists for this tenant`,
      );
    }
  }

  /**
   * Check for overlapping date ranges
   */
  private async checkDateOverlap(
    tenantId: string,
    startDate: Date,
    endDate: Date,
    excludeId?: string,
  ): Promise<void> {
    const queryBuilder = this.schoolYearRepository
      .createQueryBuilder('schoolYear')
      .where('schoolYear.tenantId = :tenantId', { tenantId })
      .andWhere('schoolYear.deletedAt IS NULL')
      .andWhere(
        '(schoolYear.startDate <= :endDate AND schoolYear.endDate >= :startDate)',
        { startDate, endDate },
      );

    if (excludeId) {
      queryBuilder.andWhere('schoolYear.id != :excludeId', { excludeId });
    }

    const overlapping = await queryBuilder.getOne();

    if (overlapping) {
      throw new ConflictException(
        `Date range overlaps with existing school year: ${overlapping.name}`,
      );
    }
  }

  /**
   * Unset default for all school years in a tenant
   */
  private async unsetDefaultForTenant(
    tenantId: string,
    queryRunner: QueryRunner,
    excludeId?: string,
  ): Promise<void> {
    const queryBuilder = queryRunner.manager
      .createQueryBuilder()
      .update(SchoolYear)
      .set({ isDefault: false })
      .where('tenantId = :tenantId', { tenantId })
      .andWhere('isDefault = :isDefault', { isDefault: true });

    if (excludeId) {
      queryBuilder.andWhere('id != :excludeId', { excludeId });
    }

    await queryBuilder.execute();
  }

  /**
   * Apply filters to query builder
   */
  private applyFilters(
    queryBuilder: SelectQueryBuilder<SchoolYear>,
    query: SchoolYearQueryDto,
  ): void {
    // Tenant filter
    if (query.tenantId) {
      queryBuilder.andWhere('schoolYear.tenantId = :tenantId', {
        tenantId: query.tenantId,
      });
    }

    // Status filter
    if (query.status) {
      queryBuilder.andWhere('schoolYear.status = :status', {
        status: query.status,
      });
    }

    // Default filter
    if (query.isDefault !== undefined) {
      queryBuilder.andWhere('schoolYear.isDefault = :isDefault', {
        isDefault: query.isDefault,
      });
    }

    // Date range filters
    if (query.startDateFrom) {
      queryBuilder.andWhere('schoolYear.startDate >= :startDateFrom', {
        startDateFrom: new Date(query.startDateFrom),
      });
    }

    if (query.startDateTo) {
      queryBuilder.andWhere('schoolYear.startDate <= :startDateTo', {
        startDateTo: new Date(query.startDateTo),
      });
    }

    if (query.endDateFrom) {
      queryBuilder.andWhere('schoolYear.endDate >= :endDateFrom', {
        endDateFrom: new Date(query.endDateFrom),
      });
    }

    if (query.endDateTo) {
      queryBuilder.andWhere('schoolYear.endDate <= :endDateTo', {
        endDateTo: new Date(query.endDateTo),
      });
    }

    // Creator filters
    if (query.createdBy) {
      queryBuilder.andWhere('schoolYear.createdBy = :createdBy', {
        createdBy: query.createdBy,
      });
    }

    if (query.updatedBy) {
      queryBuilder.andWhere('schoolYear.updatedBy = :updatedBy', {
        updatedBy: query.updatedBy,
      });
    }

    // Enrollment status filter
    if (query.enrollmentStatus) {
      queryBuilder.andWhere('schoolYear.enrollmentStatus = :enrollmentStatus', {
        enrollmentStatus: query.enrollmentStatus,
      });
    }

    // Academic calendar status filter
    if (query.academicCalendarStatus) {
      queryBuilder.andWhere(
        'schoolYear.academicCalendarStatus = :academicCalendarStatus',
        { academicCalendarStatus: query.academicCalendarStatus },
      );
    }

    // Include deleted filter
    if (query.includeDeleted) {
      queryBuilder.withDeleted();
    }
  }

  /**
   * Get upcoming deadlines
   */
  private async getUpcomingDeadlines(tenantId?: string): Promise<
    Array<{
      type: 'enrollment' | 'grade_submission' | 'graduation';
      date: string;
      schoolYearName: string;
      daysRemaining: number;
    }>
  > {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days from now

    const queryBuilder =
      this.schoolYearRepository.createQueryBuilder('schoolYear');

    if (tenantId) {
      queryBuilder.where('schoolYear.tenantId = :tenantId', { tenantId });
    }

    queryBuilder
      .andWhere('schoolYear.deletedAt IS NULL')
      .andWhere(
        '(schoolYear.enrollmentEndDate BETWEEN :now AND :futureDate OR ' +
          'schoolYear.gradeSubmissionDeadline BETWEEN :now AND :futureDate OR ' +
          'schoolYear.graduationDate BETWEEN :now AND :futureDate)',
        { now, futureDate },
      );

    const schoolYears = await queryBuilder.getMany();

    const deadlines: Array<{
      type: 'enrollment' | 'grade_submission' | 'graduation';
      date: string;
      schoolYearName: string;
      daysRemaining: number;
    }> = [];

    for (const schoolYear of schoolYears) {
      if (schoolYear.enrollmentEndDate && schoolYear.enrollmentEndDate >= now) {
        const daysRemaining = Math.ceil(
          (schoolYear.enrollmentEndDate.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        deadlines.push({
          type: 'enrollment',
          date: schoolYear.enrollmentEndDate.toISOString().split('T')[0],
          schoolYearName: schoolYear.name,
          daysRemaining,
        });
      }

      if (
        schoolYear.gradeSubmissionDeadline &&
        schoolYear.gradeSubmissionDeadline >= now
      ) {
        const daysRemaining = Math.ceil(
          (schoolYear.gradeSubmissionDeadline.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        deadlines.push({
          type: 'grade_submission',
          date: schoolYear.gradeSubmissionDeadline.toISOString().split('T')[0],
          schoolYearName: schoolYear.name,
          daysRemaining,
        });
      }

      if (schoolYear.graduationDate && schoolYear.graduationDate >= now) {
        const daysRemaining = Math.ceil(
          (schoolYear.graduationDate.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        deadlines.push({
          type: 'graduation',
          date: schoolYear.graduationDate.toISOString().split('T')[0],
          schoolYearName: schoolYear.name,
          daysRemaining,
        });
      }
    }

    // Sort by days remaining
    return deadlines.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }
}
