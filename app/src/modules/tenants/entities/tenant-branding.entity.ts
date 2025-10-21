import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
}

@Entity('tenant_branding')
export class TenantBranding extends BaseEntity {
  @ApiProperty({
    description: 'Logo URL',
    example: 'https://cdn.school.com/logo.png',
    required: false,
  })
  @Column({ length: 500, nullable: true })
  logoUrl?: string;

  @ApiProperty({
    description: 'Favicon URL',
    example: 'https://cdn.school.com/favicon.ico',
    required: false,
  })
  @Column({ length: 500, nullable: true })
  faviconUrl?: string;

  @ApiProperty({ description: 'Background image URL', required: false })
  @Column({ length: 500, nullable: true })
  backgroundImageUrl?: string;

  @ApiProperty({ description: 'Primary color', example: '#1E40AF' })
  @Column({ length: 7, default: '#1E40AF' })
  primaryColor: string;

  @ApiProperty({ description: 'Secondary color', example: '#3B82F6' })
  @Column({ length: 7, default: '#3B82F6' })
  secondaryColor: string;

  @ApiProperty({ description: 'Accent color', example: '#60A5FA' })
  @Column({ length: 7, default: '#60A5FA' })
  accentColor: string;

  @ApiProperty({
    description: 'Theme preference',
    enum: Theme,
    example: Theme.LIGHT,
  })
  @Column({
    type: 'enum',
    enum: Theme,
    default: Theme.LIGHT,
  })
  theme: Theme;

  @ApiProperty({
    description: 'Font family',
    example: 'Inter, sans-serif',
    required: false,
  })
  @Column({ length: 200, nullable: true })
  fontFamily?: string;

  @ApiProperty({ description: 'Custom CSS', required: false })
  @Column({ type: 'text', nullable: true })
  customCss?: string;

  @ApiProperty({
    description: 'Brand name',
    example: 'Springfield Elementary',
    required: false,
  })
  @Column({ length: 200, nullable: true })
  brandName?: string;

  @ApiProperty({
    description: 'Tagline',
    example: 'Excellence in Education',
    required: false,
  })
  @Column({ length: 500, nullable: true })
  tagline?: string;

  @ApiProperty({ description: 'Footer text', required: false })
  @Column({ type: 'text', nullable: true })
  footerText?: string;

  @ApiProperty({ description: 'Email logo URL', required: false })
  @Column({ length: 500, nullable: true })
  emailLogo?: string;

  @ApiProperty({ description: 'Email template name', required: false })
  @Column({ length: 100, nullable: true })
  emailTemplate?: string;
}
