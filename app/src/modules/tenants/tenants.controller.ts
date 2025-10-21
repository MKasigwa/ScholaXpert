import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
} from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantQueryDto } from './dto/tenant-query.dto';
import { TenantResponseDto, TenantSummaryDto } from './dto/tenant-response.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Tenants')
@ApiBearerAuth('JWT-auth')
@Controller('tenants')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  // @Roles('super-admin', 'system-admin')
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tenant created successfully',
    type: TenantResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Tenant with this code, domain, or email already exists',
  })
  async create(
    @Body() createTenantDto: CreateTenantDto,
    // @CurrentUser() user: any,
  ): Promise<TenantResponseDto> {
    const tenant = await this.tenantsService.create(createTenantDto);
    return TenantResponseDto.fromEntity(tenant);
  }

  @Get()
  // @Roles('super-admin', 'system-admin')
  @ApiOperation({ summary: 'Get all tenants' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tenants retrieved successfully',
    type: PaginatedResponseDto<TenantResponseDto>,
  })
  async findAll(
    @Query() query: TenantQueryDto,
  ): Promise<PaginatedResponseDto<TenantResponseDto>> {
    const result = await this.tenantsService.findAll(query);

    const responseData = result.data.map((tenant) =>
      TenantResponseDto.fromEntity(tenant),
    );

    return new PaginatedResponseDto(
      responseData,
      result.meta.total,
      result.meta.page,
      result.meta.limit,
    );
  }

  @Get('summary')
  // @Roles('super-admin', 'system-admin', 'tenant-admin')
  @ApiOperation({ summary: 'Get tenant summaries (lightweight)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tenant summaries retrieved successfully',
    type: [TenantSummaryDto],
  })
  async findSummaries(
    @Query() query: TenantQueryDto,
  ): Promise<TenantSummaryDto[]> {
    // Modify query to not include stats for better performance
    query.includeStats = false;
    query.limit = 1000; // Allow more results for summaries

    const result = await this.tenantsService.findAll(query);
    return result.data.map((tenant) => TenantSummaryDto.fromEntity(tenant));
  }

  @Get('statistics')
  // @Roles('super-admin', 'system-admin')
  @ApiOperation({ summary: 'Get tenant statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statistics retrieved successfully',
  })
  async getStatistics() {
    return this.tenantsService.getStatistics();
  }

  @Get('expiring-soon')
  // @Roles('super-admin', 'system-admin')
  @ApiOperation({ summary: 'Get tenants with expiring trials/subscriptions' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Days until expiry (default: 7)',
    example: 7,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expiring tenants retrieved successfully',
    type: [TenantResponseDto],
  })
  async getExpiringSoon(
    @Query('days') days?: number,
  ): Promise<TenantResponseDto[]> {
    const tenants = await this.tenantsService.getTenantsExpiringSoon(days);
    return tenants.map((tenant) => TenantResponseDto.fromEntity(tenant));
  }

  @Get('by-code/:code')
  // @Roles('super-admin', 'system-admin', 'tenant-admin')
  @ApiOperation({ summary: 'Get a tenant by code' })
  @ApiParam({
    name: 'code',
    description: 'Tenant code',
    example: 'springfield-elem',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tenant retrieved successfully',
    type: TenantResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tenant not found',
  })
  async findByCode(@Param('code') code: string): Promise<TenantResponseDto> {
    const tenant = await this.tenantsService.findByCode(code);
    return TenantResponseDto.fromEntity(tenant);
  }

  @Get('by-domain/:domain')
  // @Roles('super-admin', 'system-admin', 'tenant-admin')
  @ApiOperation({ summary: 'Get a tenant by domain' })
  @ApiParam({
    name: 'domain',
    description: 'Tenant domain',
    example: 'springfield-elem.edumanage.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tenant retrieved successfully',
    type: TenantResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tenant not found',
  })
  async findByDomain(
    @Param('domain') domain: string,
  ): Promise<TenantResponseDto> {
    const tenant = await this.tenantsService.findByDomain(domain);
    return TenantResponseDto.fromEntity(tenant);
  }

  @Get(':id')
  // @Roles('super-admin', 'system-admin', 'tenant-admin')
  @ApiOperation({ summary: 'Get a tenant by ID' })
  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tenant retrieved successfully',
    type: TenantResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tenant not found',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TenantResponseDto> {
    const tenant = await this.tenantsService.findOne(id);
    return TenantResponseDto.fromEntity(tenant);
  }

  @Patch(':id')
  // @Roles('super-admin', 'system-admin', 'tenant-admin')
  @ApiOperation({ summary: 'Update a tenant' })
  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tenant updated successfully',
    type: TenantResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tenant not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Tenant with this code, domain, or email already exists',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ): Promise<TenantResponseDto> {
    const tenant = await this.tenantsService.update(id, updateTenantDto);
    return TenantResponseDto.fromEntity(tenant);
  }

  @Patch(':id/toggle-status')
  // @Roles('super-admin', 'system-admin')
  @ApiOperation({ summary: 'Toggle tenant active status' })
  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tenant status updated successfully',
    type: TenantResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tenant not found',
  })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TenantResponseDto> {
    const tenant = await this.tenantsService.toggleStatus(id);
    return TenantResponseDto.fromEntity(tenant);
  }

  @Patch(':id/subscription')
  // @Roles('super-admin', 'system-admin')
  @ApiOperation({ summary: 'Update tenant subscription' })
  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tenant subscription updated successfully',
    type: TenantResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tenant not found',
  })
  async updateSubscription(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() subscriptionData: any,
  ): Promise<TenantResponseDto> {
    const tenant = await this.tenantsService.updateSubscription(
      id,
      subscriptionData,
    );
    return TenantResponseDto.fromEntity(tenant);
  }

  @Patch(':id/features')
  // @Roles('super-admin', 'system-admin', 'tenant-admin')
  @ApiOperation({ summary: 'Update tenant features' })
  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tenant features updated successfully',
    type: TenantResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tenant not found',
  })
  async updateFeatures(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() features: Record<string, boolean>,
  ): Promise<TenantResponseDto> {
    const tenant = await this.tenantsService.updateFeatures(id, features);
    return TenantResponseDto.fromEntity(tenant);
  }

  //   @Patch(':id/settings')
  //   // @Roles('super-admin', 'system-admin', 'tenant-admin')
  //   @ApiOperation({ summary: 'Update tenant settings' })
  //   @ApiParam({
  //     name: 'id',
  //     description: 'Tenant ID',
  //     type: 'string',
  //     format: 'uuid',
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.OK,
  //     description: 'Tenant settings updated successfully',
  //     type: TenantResponseDto,
  //   })
  //   @ApiResponse({
  //     status: HttpStatus.NOT_FOUND,
  //     description: 'Tenant not found',
  //   })
  //   async updateSettings(
  //     @Param('id', ParseUUIDPipe) id: string,
  //     @Body() settings: Record<string, any>,
  //   ): Promise<TenantResponseDto> {
  //     const tenant = await this.tenantsService.updateSettings(id, settings);
  //     return TenantResponseDto.fromEntity(tenant);
  //   }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @Roles('super-admin', 'system-admin')
  @ApiOperation({ summary: 'Delete a tenant (soft delete)' })
  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Tenant deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tenant not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.tenantsService.remove(id);
  }
}
