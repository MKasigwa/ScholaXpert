import {
  IsUUID,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class CreateAccessRequestDto {
  @IsUUID()
  tenantId: string;

  @IsEnum(UserRole)
  requestedRole: UserRole;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}

export class UpdateAccessRequestDto {
  @IsEnum(UserRole)
  requestedRole: UserRole;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}
