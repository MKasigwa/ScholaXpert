import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateSchoolYearDto } from './create-school-year.dto';
import { IsString } from 'class-validator';

export class UpdateSchoolYearDto extends PartialType(
  OmitType(CreateSchoolYearDto, ['tenantId', 'createdBy'] as const),
) {
  @IsString()
  updatedBy: string;
}
