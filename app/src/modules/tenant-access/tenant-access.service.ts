import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TenantAccessRequest,
  AccessRequestStatus,
} from './entities/tenant-access-request.entity';
import { User, UserStatus, UserRole } from '../users/entities/user.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import {
  CreateAccessRequestDto,
  UpdateAccessRequestDto,
} from './dto/create-access-request.dto';
import { ReviewAccessRequestDto } from './dto/review-access-request.dto';
import { AccessRequestQueryDto } from './dto/access-request-query.dto';
import { AccessRequestResponseDto } from './dto/access-request-response.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class TenantAccessService {
  constructor(
    @InjectRepository(TenantAccessRequest)
    private readonly accessRequestRepository: Repository<TenantAccessRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Create a tenant access request
   */
  async createAccessRequest(
    userId: string,
    createDto: CreateAccessRequestDto,
  ): Promise<AccessRequestResponseDto> {
    // Verify user exists and email is verified
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.emailVerified) {
      throw new BadRequestException(
        'Email must be verified before requesting access',
      );
    }

    // Verify tenant exists
    const tenant = await this.tenantRepository.findOne({
      where: { id: createDto.tenantId },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Check if user already has access to this tenant
    if (user.tenantId === createDto.tenantId) {
      throw new ConflictException('You already have access to this tenant');
    }

    // Check if there's already a pending request
    const existingRequest = await this.accessRequestRepository.findOne({
      where: {
        userId,
        tenantId: createDto.tenantId,
        status: AccessRequestStatus.PENDING,
      },
    });

    if (existingRequest) {
      throw new ConflictException(
        'You already have a pending request for this tenant',
      );
    }

    // Create the access request
    const accessRequest = this.accessRequestRepository.create({
      userId,
      tenantId: createDto.tenantId,
      requestedRole: createDto.requestedRole,
      message: createDto.message,
      status: AccessRequestStatus.PENDING,
    });

    const saved = await this.accessRequestRepository.save(accessRequest);

    // Get tenant admins
    const admins = await this.userRepository.find({
      where: {
        tenantId: createDto.tenantId,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
    });

    // Send notification to all admins
    for (const admin of admins) {
      await this.emailService.sendAccessRequestNotification(
        admin.email,
        user.fullName,
        tenant.name,
        createDto.requestedRole,
        saved.id,
      );
    }

    // Reload with relations
    const result = await this.accessRequestRepository.findOneOrFail({
      where: { id: saved.id },
      relations: ['user', 'tenant'],
    });

    return AccessRequestResponseDto.fromEntity(result);
  }

  /**
   * Get all access requests (with filtering)
   */
  async findAll(
    query: AccessRequestQueryDto,
  ): Promise<PaginatedResponseDto<AccessRequestResponseDto>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      tenantId,
      userId,
      status,
    } = query;

    const queryBuilder = this.accessRequestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.user', 'user')
      .leftJoinAndSelect('request.tenant', 'tenant')
      .leftJoinAndSelect('request.reviewer', 'reviewer');

    // Apply filters
    if (tenantId) {
      queryBuilder.andWhere('request.tenantId = :tenantId', { tenantId });
    }

    if (userId) {
      queryBuilder.andWhere('request.userId = :userId', { userId });
    }

    if (status) {
      queryBuilder.andWhere('request.status = :status', { status });
    }

    // Apply sorting
    queryBuilder.orderBy(`request.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [requests, total] = await queryBuilder.getManyAndCount();

    return {
      data: requests.map((req) => AccessRequestResponseDto.fromEntity(req)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    };
  }

  /**
   * Get access request by ID
   */
  async findOne(id: string): Promise<AccessRequestResponseDto> {
    const request = await this.accessRequestRepository.findOne({
      where: { id },
      relations: ['user', 'tenant', 'reviewer'],
    });

    if (!request) {
      throw new NotFoundException('Access request not found');
    }

    return AccessRequestResponseDto.fromEntity(request);
  }

  /**
   * Review access request (approve or reject)
   */
  async updateRequest(
    id: string,
    accessDto: UpdateAccessRequestDto,
  ): Promise<AccessRequestResponseDto> {
    const request = await this.accessRequestRepository.findOne({
      where: { id },
      relations: ['user', 'tenant'],
    });

    if (!request) {
      throw new NotFoundException('Access request not found');
    }

    if (request.status !== AccessRequestStatus.PENDING) {
      throw new BadRequestException('This request has already been reviewed');
    }

    // Update request
    request.message = accessDto.message;
    request.requestedRole = accessDto.requestedRole;

    const updated = await this.accessRequestRepository.save(request);

    // Reload with relations
    const result = await this.accessRequestRepository.findOneOrFail({
      where: { id: updated.id },
      relations: ['user', 'tenant'],
    });

    return AccessRequestResponseDto.fromEntity(result);
  }

  /**
   * Review access request (approve or reject)
   */
  async reviewRequest(
    id: string,
    reviewerId: string,
    reviewDto: ReviewAccessRequestDto,
  ): Promise<AccessRequestResponseDto> {
    const request = await this.accessRequestRepository.findOne({
      where: { id },
      relations: ['user', 'tenant'],
    });

    if (!request) {
      throw new NotFoundException('Access request not found');
    }

    if (request.status !== AccessRequestStatus.PENDING) {
      throw new BadRequestException('This request has already been reviewed');
    }

    // Verify reviewer is admin of the tenant
    const reviewer = await this.userRepository.findOne({
      where: { id: reviewerId },
    });

    if (!reviewer) {
      throw new NotFoundException('Reviewer not found');
    }

    if (reviewer.tenantId !== request.tenantId) {
      throw new ForbiddenException(
        'You can only review requests for your own tenant',
      );
    }

    if (
      reviewer.role !== UserRole.ADMIN &&
      reviewer.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException('Only admins can review access requests');
    }

    // Update request
    request.status = reviewDto.status;
    request.reviewedBy = reviewerId;
    request.reviewedAt = new Date();

    if (reviewDto.status === AccessRequestStatus.REJECTED) {
      if (!reviewDto.rejectionReason) {
        throw new BadRequestException('Rejection reason is required');
      }
      request.rejectionReason = reviewDto.rejectionReason;
    }

    const updated = await this.accessRequestRepository.save(request);

    // If approved, update user's tenant and role
    if (reviewDto.status === AccessRequestStatus.APPROVED) {
      request.user.tenantId = request.tenantId;
      request.user.role = request.requestedRole;
      request.user.status = UserStatus.ACTIVE;
      await this.userRepository.save(request.user);

      // Send approval email
      await this.emailService.sendAccessApprovedNotification(
        request.user.email,
        request.user.fullName,
        request.tenant.name,
        request.requestedRole,
      );
    } else {
      // Send rejection email
      await this.emailService.sendAccessRejectedNotification(
        request.user.email,
        request.user.fullName,
        request.tenant.name,
        reviewDto.rejectionReason || '',
      );
    }

    // Reload with relations
    const result = await this.accessRequestRepository.findOneOrFail({
      where: { id: updated.id },
      relations: ['user', 'tenant', 'reviewer'],
    });

    return AccessRequestResponseDto.fromEntity(result);
  }

  /**
   * Cancel access request
   */
  async cancelRequest(
    id: string,
    userId: string,
  ): Promise<AccessRequestResponseDto> {
    const request = await this.accessRequestRepository.findOne({
      where: { id },
      relations: ['user', 'tenant'],
    });

    if (!request) {
      throw new NotFoundException('Access request not found');
    }

    if (request.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own requests');
    }

    if (request.status !== AccessRequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be cancelled');
    }

    request.status = AccessRequestStatus.CANCELLED;
    const updated = await this.accessRequestRepository.save(request);

    return AccessRequestResponseDto.fromEntity(updated);
  }

  /**
   * Get user's access requests
   */
  async getUserRequests(userId: string): Promise<AccessRequestResponseDto[]> {
    const requests = await this.accessRequestRepository.find({
      where: { userId },
      relations: ['user', 'tenant', 'reviewer'],
      order: { createdAt: 'DESC' },
    });

    return requests.map((req) => AccessRequestResponseDto.fromEntity(req));
  }

  /**
   * Get tenant's pending access requests (for admins)
   */
  async getTenantPendingRequests(
    tenantId: string,
  ): Promise<AccessRequestResponseDto[]> {
    const requests = await this.accessRequestRepository.find({
      where: {
        tenantId,
        status: AccessRequestStatus.PENDING,
      },
      relations: ['user', 'tenant'],
      order: { createdAt: 'DESC' },
    });

    return requests.map((req) => AccessRequestResponseDto.fromEntity(req));
  }

  /**
   * Check if user has pending access request
   */
  async checkPendingAccessRequest(
    userId: string,
  ): Promise<{ hasPendingRequest: boolean; pendingRequestId?: string }> {
    const pendingRequest = await this.accessRequestRepository.findOne({
      where: {
        userId,
        status: AccessRequestStatus.PENDING,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      hasPendingRequest: !!pendingRequest,
      pendingRequestId: pendingRequest?.id,
    };
  }
}
