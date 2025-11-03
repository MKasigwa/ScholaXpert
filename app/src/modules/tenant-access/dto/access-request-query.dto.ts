import { IsOptional, IsEnum, IsUUID, IsString } from 'class-validator';
import { BaseQueryDto } from '../../../common/dto/base-query.dto';
import { AccessRequestStatus } from '../entities/tenant-access-request.entity';

export class AccessRequestQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsEnum(AccessRequestStatus)
  status?: AccessRequestStatus;

  @IsOptional()
  @IsString()
  sortOrder?: 'DESC' | 'ASC';
}
