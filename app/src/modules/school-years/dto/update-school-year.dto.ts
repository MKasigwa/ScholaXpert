import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateSchoolYearDto } from './create-school-year.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSchoolYearDto extends PartialType(
  OmitType(CreateSchoolYearDto, ['tenantId', 'createdBy'] as const),
) {
  @ApiProperty({
    description: 'User who updated this school year',
    example: 'admin@school.com',
  })
  @IsString()
  updatedBy: string;
}
