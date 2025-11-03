import { Tenant, TenantStatus } from '../entities/tenant.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Simplified address DTO for tenant summary
 */
export class AddressSummaryDto {
  @ApiProperty({ description: 'Street address', example: '123 Main Street' })
  street: string;

  @ApiProperty({ description: 'City', example: 'Springfield' })
  city: string;

  @ApiProperty({ description: 'State or province', example: 'Illinois' })
  state: string;

  @ApiProperty({ description: 'Country', example: 'United States' })
  country: string;

  @ApiPropertyOptional({ description: 'Postal or ZIP code', example: '62704' })
  postalCode?: string;
}

/**
 * Simplified tenant DTO for listings and search results
 * Used when full tenant details are not needed
 */
export class TenantSummaryDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({
    description: 'Tenant name',
    example: 'Springfield Elementary School',
  })
  name: string;

  @ApiProperty({
    description: 'Tenant slug (URL-friendly identifier)',
    example: 'springfield-elementary',
  })
  slug: string;

  @ApiProperty({ description: 'Tenant status', enum: TenantStatus })
  status: TenantStatus;

  @ApiPropertyOptional({
    description: 'Contact email',
    example: 'admin@springfield-elem.edu',
  })
  email?: string;

  @ApiPropertyOptional({ description: 'Contact phone', example: '+1-555-0123' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Logo URL' })
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Address information',
    type: AddressSummaryDto,
  })
  address?: AddressSummaryDto;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  static fromEntity(tenant: Tenant): TenantSummaryDto {
    const dto = new TenantSummaryDto();
    dto.id = tenant.id;
    dto.name = tenant.name;
    dto.slug = tenant.slug;
    dto.status = tenant.status;

    // Get email and phone from contactInfo
    dto.email = tenant.contactInfo?.email;
    dto.phone = tenant.contactInfo?.phone;

    // Get logo from branding
    dto.logoUrl = tenant.branding?.logoUrl;

    dto.createdAt = tenant.createdAt;

    // Include address if available
    if (tenant.location?.address) {
      const address = tenant.location.address;
      dto.address = {
        street: address.street2
          ? `${address.street1}, ${address.street2}`
          : address.street1,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postalCode,
      };
    }

    return dto;
  }

  static fromEntities(tenants: Tenant[]): TenantSummaryDto[] {
    return tenants.map((tenant) => this.fromEntity(tenant));
  }
}
