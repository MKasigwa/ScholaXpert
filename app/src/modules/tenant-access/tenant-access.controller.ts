import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TenantAccessService } from './tenant-access.service';
import {
  CreateAccessRequestDto,
  UpdateAccessRequestDto,
} from './dto/create-access-request.dto';
import { ReviewAccessRequestDto } from './dto/review-access-request.dto';
import { AccessRequestQueryDto } from './dto/access-request-query.dto';
import { AccessRequestResponseDto } from './dto/access-request-response.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AccessRequestStatus } from './entities/tenant-access-request.entity';

@Controller('tenant-access')
@UseGuards(JwtAuthGuard)
export class TenantAccessController {
  constructor(private readonly tenantAccessService: TenantAccessService) {}

  /**
   * Create access request
   * POST /api/tenant-access/request
   */
  @Post('request')
  @HttpCode(HttpStatus.CREATED)
  async createRequest(
    @CurrentUser('userId') userId: string,
    @Body() createDto: CreateAccessRequestDto,
  ): Promise<AccessRequestResponseDto> {
    return this.tenantAccessService.createAccessRequest(userId, createDto);
  }

  /**
   * Get all access requests (with filters)
   * GET /api/tenant-access/requests
   */
  @Get('requests')
  async getAllRequests(
    @Query() query: AccessRequestQueryDto,
  ): Promise<PaginatedResponseDto<AccessRequestResponseDto>> {
    return this.tenantAccessService.findAll(query);
  }

  /**
   * Get current user's access requests
   * GET /api/tenant-access/my-requests
   */
  @Get('my-requests')
  async getMyRequests(
    @CurrentUser('userId') userId: string,
  ): Promise<AccessRequestResponseDto[]> {
    return this.tenantAccessService.getUserRequests(userId);
  }

  @Get('tenant/:tenantId/requests')
  async getTenantByStatus(
    @Param('tenantId') tenantId: string,
    @Query('status') status: AccessRequestStatus,
  ): Promise<AccessRequestResponseDto[]> {
    return this.tenantAccessService.getTenantRequestsByStatus(tenantId, status);
  }

  /**
   * Get tenant's pending requests (for admins)
   * GET /api/tenant-access/tenant/:tenantId/pending
   */
  @Get('tenant/:tenantId/pending')
  async getTenantPendingRequests(
    @Param('tenantId') tenantId: string,
  ): Promise<AccessRequestResponseDto[]> {
    return this.tenantAccessService.getTenantPendingRequests(tenantId);
  }

  /**
   * Get single access request
   * GET /api/tenant-access/requests/:id
   */
  @Get('requests/:id')
  async getRequest(@Param('id') id: string): Promise<AccessRequestResponseDto> {
    return this.tenantAccessService.findOne(id);
  }

  /**
   * Review access request (approve/reject)
   * PATCH /api/tenant-access/requests/:id/review
   */
  @Patch('requests/:id/review')
  async reviewRequest(
    @Param('id') id: string,
    @CurrentUser('userId') reviewerId: string,
    @Body() reviewDto: ReviewAccessRequestDto,
  ): Promise<AccessRequestResponseDto> {
    return this.tenantAccessService.reviewRequest(id, reviewerId, reviewDto);
  }

  /**
   * Cancel access request
   * PATCH /api/tenant-access/requests/:id/cancel
   */
  @Patch('requests/:id/cancel')
  async cancelRequest(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<AccessRequestResponseDto> {
    return this.tenantAccessService.cancelRequest(id, userId);
  }

  /**
   * Review access request (approve/reject)
   * PATCH /api/tenant-access/requests/:id/review
   */
  @Patch('requests/:id')
  async updateRequest(
    @Param('id') id: string,
    @Body() reviewDto: UpdateAccessRequestDto,
  ): Promise<AccessRequestResponseDto> {
    return this.tenantAccessService.updateRequest(id, reviewDto);
  }
}
