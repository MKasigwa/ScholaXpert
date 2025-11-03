import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CurrentUserDto {
  @ApiProperty({
    description: 'User Id',
    example: 'ce43470c-1097-485f-8e59-de444f886fba',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Search term',
    example: 'search term',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'role',
    example: 'staff',
  })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiPropertyOptional({
    description: 'tenantId',
    example: 'ce43470c-1097-485f-8e59-de444f886fba',
  })
  @IsOptional()
  @IsString()
  tenantId?: string;
}
