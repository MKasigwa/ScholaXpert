import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { SchoolYearsService } from './school-years.service';
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';
import { SchoolYearQueryDto } from './dto/school-year-query.dto';
import { SchoolYearResponseDto } from './dto/school-year-response.dto';
import { SchoolYearSummaryDto } from './dto/school-year-summary.dto';
import {
  BulkUpdateStatusDto,
  BulkDeleteDto,
  SetDefaultDto,
  RestoreDto,
  DeleteDto,
} from './dto/bulk-action.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from 'src/common/dto/current-user.dto';
// import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('School Years')
@ApiBearerAuth('JWT-auth')
@Controller('school-years')
@UseGuards(JwtAuthGuard)
export class SchoolYearsController {
  constructor(private readonly schoolYearsService: SchoolYearsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new school year',
    description:
      'Creates a new school year for a tenant with comprehensive validation and automatic default handling',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'School year created successfully',
    type: SchoolYearResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or date validation failed',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'School year with this code already exists for the tenant',
  })
  async create(
    @Body() createSchoolYearDto: CreateSchoolYearDto,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<SchoolYearResponseDto> {
    const userId = user?.userId;

    const schoolYear = await this.schoolYearsService.create(
      createSchoolYearDto,
      userId,
    );
    return SchoolYearResponseDto.fromEntity(schoolYear);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all school years',
    description:
      'Retrieve a paginated list of school years with advanced filtering, sorting, and search capabilities',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'School years retrieved successfully',
    type: PaginatedResponseDto<SchoolYearResponseDto>,
  })
  async findAll(
    @Query() query: SchoolYearQueryDto,
  ): Promise<PaginatedResponseDto<SchoolYearResponseDto>> {
    const result = await this.schoolYearsService.findAll(query);

    const responseData = result.data.map((schoolYear) =>
      SchoolYearResponseDto.fromEntity(schoolYear),
    );

    return new PaginatedResponseDto(
      responseData,
      result.meta.total,
      result.meta.page,
      result.meta.limit,
    );
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Get school year summaries (lightweight)',
    description:
      'Get a lightweight list of school years for dropdowns, selectors, and quick views',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'School year summaries retrieved successfully',
    type: [SchoolYearSummaryDto],
  })
  async findSummaries(
    @Query() query: SchoolYearQueryDto,
  ): Promise<SchoolYearSummaryDto[]> {
    query.limit = query.limit || 1000;

    const result = await this.schoolYearsService.findAll(query);
    return result.data.map((schoolYear) =>
      SchoolYearSummaryDto.fromEntity(schoolYear),
    );
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Get school year statistics',
    description:
      'Get comprehensive statistics including counts by status, enrollment info, and upcoming deadlines',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statistics retrieved successfully',
  })
  @ApiQuery({
    name: 'tenantId',
    required: false,
    description: 'Filter statistics by tenant ID',
    type: String,
  })
  async getStatistics(@Query('tenantId') tenantId?: string) {
    return this.schoolYearsService.getStatistics(tenantId);
  }

  @Get('current')
  @ApiOperation({
    summary: 'Get the current active school year',
    description:
      'Returns the school year that is currently within its date range and has active status',
  })
  @ApiQuery({
    name: 'tenantId',
    required: true,
    description: 'Tenant ID to find current school year for',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current school year retrieved successfully',
    type: SchoolYearResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No current school year found',
  })
  async getCurrent(
    @Query('tenantId', ParseUUIDPipe) tenantId: string,
  ): Promise<SchoolYearResponseDto> {
    const schoolYear = await this.schoolYearsService.findCurrent(tenantId);
    return SchoolYearResponseDto.fromEntity(schoolYear);
  }

  @Get('default')
  @ApiOperation({
    summary: 'Get the default school year',
    description: 'Returns the school year marked as default for a tenant',
  })
  @ApiQuery({
    name: 'tenantId',
    required: true,
    description: 'Tenant ID to find default school year for',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Default school year retrieved successfully',
    type: SchoolYearResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No default school year found',
  })
  async getDefault(
    @Query('tenantId', ParseUUIDPipe) tenantId: string,
  ): Promise<SchoolYearResponseDto> {
    const schoolYear = await this.schoolYearsService.findDefault(tenantId);
    return SchoolYearResponseDto.fromEntity(schoolYear);
  }

  @Get('tenant/:tenantId')
  @ApiOperation({
    summary: 'Get school years by tenant',
    description:
      'Retrieve all school years for a specific tenant (used in school year switcher)',
  })
  @ApiParam({
    name: 'tenantId',
    description: 'Tenant ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'School years retrieved successfully',
    type: [SchoolYearResponseDto],
  })
  async findByTenant(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
  ): Promise<SchoolYearResponseDto[]> {
    const schoolYears = await this.schoolYearsService.findByTenant(tenantId);
    return schoolYears.map((schoolYear) =>
      SchoolYearResponseDto.fromEntity(schoolYear),
    );
  }

  @Get('tenant/:tenantId/code/:code')
  @ApiOperation({
    summary: 'Get a school year by tenant and code',
    description:
      'Find a school year by its unique code within a specific tenant',
  })
  @ApiParam({
    name: 'tenantId',
    description: 'Tenant ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiParam({
    name: 'code',
    description: 'School year code',
    example: '2024-25',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'School year retrieved successfully',
    type: SchoolYearResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'School year not found',
  })
  async findByTenantAndCode(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @Param('code') code: string,
  ): Promise<SchoolYearResponseDto> {
    const schoolYear = await this.schoolYearsService.findByCode(code, tenantId);
    return SchoolYearResponseDto.fromEntity(schoolYear);
  }

  @Get('by-code/:code')
  @ApiOperation({
    summary: 'Get a school year by code',
    description:
      'Find a school year by its unique code within a tenant (requires tenantId query param)',
  })
  @ApiParam({
    name: 'code',
    description: 'School year code',
    example: '2024-25',
  })
  @ApiQuery({
    name: 'tenantId',
    required: true,
    description: 'Tenant ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'School year retrieved successfully',
    type: SchoolYearResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'School year not found',
  })
  async findByCode(
    @Param('code') code: string,
    @Query('tenantId', ParseUUIDPipe) tenantId: string,
  ): Promise<SchoolYearResponseDto> {
    const schoolYear = await this.schoolYearsService.findByCode(code, tenantId);
    return SchoolYearResponseDto.fromEntity(schoolYear);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a school year by ID',
    description: 'Retrieve detailed information about a specific school year',
  })
  @ApiParam({
    name: 'id',
    description: 'School year ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    description: 'Include soft-deleted school years',
    type: Boolean,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'School year retrieved successfully',
    type: SchoolYearResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'School year not found',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeDeleted') includeDeleted?: boolean,
  ): Promise<SchoolYearResponseDto> {
    const schoolYear = await this.schoolYearsService.findOne(
      id,
      includeDeleted,
    );
    return SchoolYearResponseDto.fromEntity(schoolYear);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a school year (PUT)',
    description:
      'Update school year information with validation and automatic default management',
  })
  @ApiParam({
    name: 'id',
    description: 'School year ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'School year updated successfully',
    type: SchoolYearResponseDto,
  })
  async updatePut(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSchoolYearDto: UpdateSchoolYearDto,
  ): Promise<SchoolYearResponseDto> {
    const schoolYear = await this.schoolYearsService.update(
      id,
      updateSchoolYearDto,
    );
    return SchoolYearResponseDto.fromEntity(schoolYear);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a school year (PATCH)',
    description:
      'Update school year information with validation and automatic default management',
  })
  @ApiParam({
    name: 'id',
    description: 'School year ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'School year updated successfully',
    type: SchoolYearResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSchoolYearDto: UpdateSchoolYearDto,
  ): Promise<SchoolYearResponseDto> {
    const schoolYear = await this.schoolYearsService.update(
      id,
      updateSchoolYearDto,
    );
    return SchoolYearResponseDto.fromEntity(schoolYear);
  }

  @Post(':id/set-default')
  @ApiOperation({
    summary: 'Set a school year as default',
    description:
      'Mark a school year as default for its tenant (automatically unsets previous default)',
  })
  @ApiParam({
    name: 'id',
    description: 'School year ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({ type: SetDefaultDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'School year set as default successfully',
    type: SchoolYearResponseDto,
  })
  async setAsDefault(
    @Param('id', ParseUUIDPipe) id: string,
    // @Body() dto: SetDefaultDto,
  ): Promise<SchoolYearResponseDto> {
    const schoolYear = await this.schoolYearsService.setAsDefault(id);
    return SchoolYearResponseDto.fromEntity(schoolYear);
  }

  @Patch(':id/set-default')
  @ApiOperation({
    summary: 'Set a school year as default (PATCH)',
    description: 'Mark a school year as default for its tenant',
  })
  @ApiParam({
    name: 'id',
    description: 'School year ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'School year set as default successfully',
    type: SchoolYearResponseDto,
  })
  async setAsDefaultPatch(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SchoolYearResponseDto> {
    const schoolYear = await this.schoolYearsService.setAsDefault(id);
    return SchoolYearResponseDto.fromEntity(schoolYear);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({
    summary: 'Toggle school year status',
    description: 'Toggle between active, draft, and archived status',
  })
  @ApiParam({
    name: 'id',
    description: 'School year ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'School year status updated successfully',
    type: SchoolYearResponseDto,
  })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SchoolYearResponseDto> {
    const schoolYear = await this.schoolYearsService.toggleStatus(id);
    return SchoolYearResponseDto.fromEntity(schoolYear);
  }

  @Patch(':id/activate')
  @ApiOperation({
    summary: 'Activate a school year',
    description: 'Set a school year status to active',
  })
  @ApiParam({
    name: 'id',
    description: 'School year ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'School year activated successfully',
    type: SchoolYearResponseDto,
  })
  async activate(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SchoolYearResponseDto> {
    const schoolYear = await this.schoolYearsService.activate(id);
    return SchoolYearResponseDto.fromEntity(schoolYear);
  }

  @Patch(':id/archive')
  @ApiOperation({
    summary: 'Archive a school year',
    description: 'Set a school year status to archived',
  })
  @ApiParam({
    name: 'id',
    description: 'School year ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'School year archived successfully',
    type: SchoolYearResponseDto,
  })
  async archive(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SchoolYearResponseDto> {
    const schoolYear = await this.schoolYearsService.archive(id);
    return SchoolYearResponseDto.fromEntity(schoolYear);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a school year (soft delete)',
    description: 'Soft delete a school year - can be restored later',
  })
  @ApiParam({
    name: 'id',
    description: 'School year ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({ type: DeleteDto })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'School year deleted successfully',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    // @Body() dto: DeleteDto,
  ): Promise<void> {
    await this.schoolYearsService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({
    summary: 'Restore a soft-deleted school year',
    description: 'Restore a previously deleted school year',
  })
  @ApiParam({
    name: 'id',
    description: 'School year ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({ type: RestoreDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'School year restored successfully',
    type: SchoolYearResponseDto,
  })
  async restore(
    @Param('id', ParseUUIDPipe) id: string,
    // @Body() dto: RestoreDto,
  ): Promise<SchoolYearResponseDto> {
    const schoolYear = await this.schoolYearsService.restore(id);
    return SchoolYearResponseDto.fromEntity(schoolYear);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Permanently delete a school year',
    description: 'Permanently delete a school year - cannot be restored',
  })
  @ApiParam({
    name: 'id',
    description: 'School year ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'School year permanently deleted successfully',
  })
  async permanentDelete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.schoolYearsService.permanentDelete(id);
  }

  @Post('bulk/update-status')
  @ApiOperation({
    summary: 'Bulk update status',
    description: 'Update status for multiple school years at once',
  })
  @ApiBody({ type: BulkUpdateStatusDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'School years updated successfully',
  })
  async bulkUpdateStatus(@Body() dto: BulkUpdateStatusDto): Promise<void> {
    await this.schoolYearsService.bulkUpdateStatus(
      dto.ids,
      dto.status,
      dto.updatedBy,
    );
  }

  @Post('bulk/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Bulk delete school years',
    description: 'Soft delete multiple school years at once',
  })
  @ApiBody({ type: BulkDeleteDto })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'School years deleted successfully',
  })
  async bulkDelete(@Body() dto: BulkDeleteDto): Promise<void> {
    await this.schoolYearsService.bulkDelete(
      dto.ids,
      // , dto.deletedBy
    );
  }
}
