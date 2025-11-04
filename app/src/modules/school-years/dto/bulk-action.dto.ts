import {
  IsArray,
  IsString,
  IsEnum,
  IsUUID,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { SchoolYearStatus } from '../entities/school-year.entity';

export class BulkUpdateStatusDto {
  @ApiProperty({
    description: 'Array of school year IDs to update',
    example: ['uuid1', 'uuid2', 'uuid3'],
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  ids: string[];

  @ApiProperty({
    description: 'New status for all school years',
    enum: ['draft', 'active', 'archived'],
    example: 'active',
  })
  @IsEnum(['draft', 'active', 'archived'])
  status: SchoolYearStatus;

  @ApiProperty({
    description: 'User who performed the update',
    example: 'admin@school.com',
  })
  @IsString()
  updatedBy: string;
}

export class BulkDeleteDto {
  @ApiProperty({
    description: 'Array of school year IDs to delete',
    example: ['uuid1', 'uuid2', 'uuid3'],
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  ids: string[];

  @ApiProperty({
    description: 'User who performed the deletion',
    example: 'admin@school.com',
  })
  @IsString()
  deletedBy: string;
}

export class SetDefaultDto {
  @ApiProperty({
    description: 'User who set the default',
    example: 'admin@school.com',
    required: false,
  })
  @IsString()
  setBy?: string;
}

export class RestoreDto {
  @ApiProperty({
    description: 'User who performed the restoration',
    example: 'admin@school.com',
    required: false,
  })
  @IsString()
  restoredBy?: string;
}

export class DeleteDto {
  @ApiProperty({
    description: 'User who performed the deletion',
    example: 'admin@school.com',
    required: false,
  })
  @IsString()
  deletedBy?: string;
}
