import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Minimal DTO for quick tenant creation
 * Only requires essential information - other details can be added later
 */
export class CreateTenantMinimalDto {
  @ApiProperty({
    description: 'Tenant/School name',
    example: 'Springfield Elementary School',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  name: string;

  @ApiProperty({
    description: 'Unique school code/identifier',
    example: 'SPR-ELEM-001',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  @Matches(/^[A-Z0-9-]+$/i, {
    message: 'Code must contain only letters, numbers, and hyphens',
  })
  code: string;

  @ApiProperty({
    description: 'Primary contact email',
    example: 'admin@springfield-elem.edu',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Primary contact phone',
    example: '+15550123456',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({
    description: 'Street address',
    example: '123 Main Street',
  })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional({
    description: 'City',
    example: 'Springfield',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'State or province',
    example: 'Illinois',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'United States',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Postal code',
    example: '62704',
  })
  @IsOptional()
  @IsString()
  postalCode?: string;
}
