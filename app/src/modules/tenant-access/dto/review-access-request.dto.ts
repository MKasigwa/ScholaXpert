import {
  IsEnum,
  IsString,
  MaxLength,
  //  ValidateIf
} from 'class-validator';
import { AccessRequestStatus } from '../entities/tenant-access-request.entity';

export class ReviewAccessRequestDto {
  @IsEnum([AccessRequestStatus.APPROVED, AccessRequestStatus.REJECTED])
  status: AccessRequestStatus.APPROVED | AccessRequestStatus.REJECTED;

  // @ValidateIf(
  //   (o: { status: AccessRequestStatus }) =>
  //     o.status === AccessRequestStatus.REJECTED,
  // )
  @IsString()
  @MaxLength(500)
  reviewNotes?: string;
}
