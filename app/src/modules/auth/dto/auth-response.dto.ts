import { User, UserRole, UserStatus } from '../../users/entities/user.entity';

export class UserResponseDto {
  id: string;
  email: string;
  username?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  status: UserStatus;
  tenantId?: string;
  avatar?: string;
  department?: string;
  designation?: string;
  emailVerified: boolean;
  hasPendingRequest: boolean;
  pendingRequestId: string | null;
  lastLoginAt?: Date;
  createdAt: Date;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.username = user.username;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.fullName = user.fullName;
    dto.phoneNumber = user.phoneNumber;
    dto.role = user.role;
    dto.status = user.status;
    dto.tenantId = user.tenantId;
    dto.avatar = user.avatar;
    dto.department = user.department;
    dto.designation = user.designation;
    dto.emailVerified = user.emailVerified;
    dto.lastLoginAt = user.lastLoginAt;
    dto.createdAt = user.createdAt;
    return dto;
  }
}

export class AuthResponseDto {
  accessToken: string;
  refreshToken?: string;
  user: UserResponseDto;
  expiresIn: number;
}

export class RefreshTokenDto {
  accessToken: string;
  expiresIn: number;
}
