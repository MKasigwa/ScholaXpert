import {
  TenantAccessRequest,
  AccessRequestStatus,
} from '../entities/tenant-access-request.entity';
import { UserRole } from '../../users/entities/user.entity';

interface AccessRequestTenant {
  id: string;
  name: string;
  code: string;
  type?: string;
}

export class AccessRequestResponseDto {
  id: string;
  userId: string;
  userEmail: string;
  userFullName: string;
  tenantId: string;
  tenant?: AccessRequestTenant;
  requestedRole: UserRole;
  status: AccessRequestStatus;
  message?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewerName?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: TenantAccessRequest): AccessRequestResponseDto {
    const dto = new AccessRequestResponseDto();
    dto.id = entity.id;
    dto.userId = entity.userId;
    dto.userEmail = entity.user?.email;
    dto.userFullName = entity.user
      ? `${entity.user.firstName} ${entity.user.lastName}`
      : '';
    dto.tenantId = entity.tenantId;
    dto.tenant = {
      id: entity.tenant.id,
      name: entity.tenant.name,
      code: entity.tenant.slug,
      type: entity.tenant.schoolInfo.type,
    };
    dto.requestedRole = entity.requestedRole;
    dto.status = entity.status;
    dto.message = entity.message;
    dto.rejectionReason = entity.rejectionReason;
    dto.reviewedBy = entity.reviewedBy;
    dto.reviewerName = entity.reviewer
      ? `${entity.reviewer.firstName} ${entity.reviewer.lastName}`
      : undefined;
    dto.reviewedAt = entity.reviewedAt;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
