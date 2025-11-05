import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsUrl,
  IsEnum,
  IsArray,
  IsNumber,
  IsBoolean,
  IsDateString,
  ValidateNested,
  Min,
  Max,
  Length,
  Matches,
  IsInt,
  IsPositive,
  ArrayMinSize,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Import enums from entities
import {
  SchoolType,
  SchoolCategory,
  EducationLevel,
  AcademicCalendarType,
} from '../entities/school-info.entity';
import {
  SubscriptionPlan,
  BillingCycle,
} from '../entities/tenant-subscription.entity';
import { AccreditationStatus } from '../entities/accreditation-info.entity';

// Address DTOs
export class CoordinatesDto {
  @ApiProperty({ description: 'Latitude coordinate', example: 39.7817 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ description: 'Longitude coordinate', example: -89.6501 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}

export class AddressDto {
  @ApiPropertyOptional({
    description: 'Street address line 1',
    example: '123 Main Street',
  })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  street1?: string;

  @ApiPropertyOptional({
    description: 'Street address line 2',
    example: 'Suite 100',
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  street2?: string;

  @ApiProperty({ description: 'City', example: 'Springfield' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  city: string;

  @ApiProperty({ description: 'State or province', example: 'Illinois' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  state: string;

  @ApiPropertyOptional({ description: 'Postal or ZIP code', example: '62704' })
  @IsString()
  @IsOptional()
  @Length(1, 20)
  postalCode?: string;

  @ApiProperty({ description: 'Country', example: 'United States' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  country: string;

  @ApiPropertyOptional({ description: 'Coordinates', type: CoordinatesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;
}

// Contact person DTO
export class ContactPersonDto {
  @ApiProperty({ description: 'Contact person name', example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  name: string;

  @ApiProperty({ description: 'Contact person title', example: 'Principal' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @ApiProperty({
    description: 'Contact person email',
    example: 'john.smith@springfield-elem.edu',
  })
  @IsEmail()
  @Length(1, 255)
  email: string;

  @ApiProperty({ description: 'Contact person phone', example: '+1-555-0123' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  phone: string;

  @ApiPropertyOptional({ description: 'Department', example: 'Administration' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  department?: string;
}

// Contact info DTO
export class TenantContactInfoDto {
  @ApiProperty({ description: 'Primary contact', type: ContactPersonDto })
  @ValidateNested()
  @Type(() => ContactPersonDto)
  primaryContact: ContactPersonDto;

  @ApiPropertyOptional({
    description: 'Billing contact',
    type: ContactPersonDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactPersonDto)
  billingContact?: ContactPersonDto;

  @ApiPropertyOptional({
    description: 'Technical contact',
    type: ContactPersonDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactPersonDto)
  technicalContact?: ContactPersonDto;

  @ApiPropertyOptional({
    description: 'Emergency contact',
    type: ContactPersonDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactPersonDto)
  emergencyContact?: ContactPersonDto;

  @ApiProperty({ description: 'Primary phone number', example: '+1-555-0123' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  phone: string;

  @ApiProperty({
    description: 'Primary email',
    example: 'admin@springfield-elem.edu',
  })
  @IsEmail()
  @Length(1, 255)
  email: string;

  @ApiPropertyOptional({
    description: 'Website URL',
    example: 'https://springfield-elem.edu',
  })
  @IsOptional()
  @IsUrl()
  @Length(1, 255)
  website?: string;

  @ApiProperty({ description: 'Address', type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}

// Location DTO
export class TenantLocationDto {
  @ApiProperty({ description: 'Timezone', example: 'America/Chicago' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  timezone: string;

  @ApiProperty({ description: 'Locale', example: 'en_US' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  locale: string;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  currency: string;

  @ApiProperty({ description: 'Region', example: 'North America' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  region: string;

  @ApiProperty({ description: 'Country', example: 'United States' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  country: string;

  @ApiProperty({ description: 'Address', type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}

// Accreditation info DTO
export class AccreditationInfoDto {
  @ApiProperty({
    description: 'Accrediting body',
    example: 'State Board of Education',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  body: string;

  @ApiProperty({
    description: 'Accreditation status',
    enum: ['accredited', 'pending', 'expired', 'denied'],
    example: 'accredited',
  })
  @IsEnum(['accredited', 'pending', 'expired', 'denied'])
  status: AccreditationStatus;

  @ApiPropertyOptional({ description: 'Expiry date', example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiPropertyOptional({
    description: 'Certificate number',
    example: 'ACC-2024-001',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  certificateNumber?: string;
}

// School info DTO
export class SchoolInfoDto {
  @ApiProperty({
    description: 'School type',
    enum: SchoolType,
    example: SchoolType.PUBLIC,
  })
  @IsEnum(SchoolType)
  type: SchoolType;

  @ApiProperty({
    description: 'School category',
    enum: SchoolCategory,
    example: SchoolCategory.ELEMENTARY,
  })
  @IsEnum(SchoolCategory)
  category: SchoolCategory;

  @ApiProperty({
    description: 'Education levels offered',
    enum: EducationLevel,
    isArray: true,
    example: [EducationLevel.KINDERGARTEN, EducationLevel.ELEMENTARY],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(EducationLevel, { each: true })
  levels: EducationLevel[];

  @ApiPropertyOptional({
    description: 'Year the school was founded',
    example: 1985,
  })
  @IsOptional()
  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear())
  foundedYear?: number;

  @ApiPropertyOptional({ description: 'Principal name', example: 'John Smith' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  principalName?: string;

  @ApiProperty({ description: 'Student capacity', example: 500 })
  @IsInt()
  @IsPositive()
  studentCapacity: number;

  @ApiProperty({ description: 'Current enrollment', example: 425 })
  @IsInt()
  @Min(0)
  currentEnrollment: number;

  @ApiProperty({ description: 'Staff count', example: 45 })
  @IsInt()
  @Min(0)
  staffCount: number;

  @ApiPropertyOptional({
    description: 'Accreditation information',
    type: [AccreditationInfoDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AccreditationInfoDto)
  accreditation?: AccreditationInfoDto[];

  @ApiProperty({
    description: 'Academic calendar type',
    enum: AcademicCalendarType,
    example: AcademicCalendarType.SEMESTER,
  })
  @IsEnum(AcademicCalendarType)
  academicCalendar: AcademicCalendarType;

  @ApiProperty({
    description: 'Languages offered',
    example: ['English', 'Spanish', 'French'],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  languagesOffered: string[];

  @ApiPropertyOptional({
    description: 'Special programs',
    example: ['STEM', 'Arts', 'Sports'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialPrograms?: string[];
}

// Features DTO
export class TenantFeaturesDto {
  @ApiPropertyOptional({ description: 'Academic management', example: true })
  @IsOptional()
  @IsBoolean()
  academicManagement?: boolean;

  @ApiPropertyOptional({ description: 'Fee management', example: true })
  @IsOptional()
  @IsBoolean()
  feeManagement?: boolean;

  @ApiPropertyOptional({ description: 'Library management', example: false })
  @IsOptional()
  @IsBoolean()
  libraryManagement?: boolean;

  @ApiPropertyOptional({ description: 'Transport management', example: false })
  @IsOptional()
  @IsBoolean()
  transportManagement?: boolean;

  @ApiPropertyOptional({ description: 'Inventory management', example: false })
  @IsOptional()
  @IsBoolean()
  inventoryManagement?: boolean;

  @ApiPropertyOptional({ description: 'HR management', example: false })
  @IsOptional()
  @IsBoolean()
  hrManagement?: boolean;

  @ApiPropertyOptional({ description: 'Parent portal', example: true })
  @IsOptional()
  @IsBoolean()
  parentPortal?: boolean;

  @ApiPropertyOptional({ description: 'Student portal', example: true })
  @IsOptional()
  @IsBoolean()
  studentPortal?: boolean;

  @ApiPropertyOptional({ description: 'Mobile app', example: false })
  @IsOptional()
  @IsBoolean()
  mobileApp?: boolean;

  @ApiPropertyOptional({ description: 'Reports and analytics', example: true })
  @IsOptional()
  @IsBoolean()
  reportsAnalytics?: boolean;

  @ApiPropertyOptional({ description: 'Timetable management', example: true })
  @IsOptional()
  @IsBoolean()
  timetableManagement?: boolean;

  @ApiPropertyOptional({ description: 'Communication tools', example: true })
  @IsOptional()
  @IsBoolean()
  communicationTools?: boolean;

  @ApiPropertyOptional({ description: 'Exam management', example: true })
  @IsOptional()
  @IsBoolean()
  examManagement?: boolean;

  @ApiPropertyOptional({ description: 'Discipline tracking', example: false })
  @IsOptional()
  @IsBoolean()
  disciplineTracking?: boolean;

  @ApiPropertyOptional({ description: 'Health records', example: false })
  @IsOptional()
  @IsBoolean()
  healthRecords?: boolean;

  @ApiPropertyOptional({ description: 'Custom fields', example: false })
  @IsOptional()
  @IsBoolean()
  customFields?: boolean;

  @ApiPropertyOptional({ description: 'API access', example: false })
  @IsOptional()
  @IsBoolean()
  apiAccess?: boolean;

  @ApiPropertyOptional({ description: 'SSO integration', example: false })
  @IsOptional()
  @IsBoolean()
  ssoIntegration?: boolean;

  @ApiPropertyOptional({ description: 'Custom branding', example: false })
  @IsOptional()
  @IsBoolean()
  customBranding?: boolean;

  @ApiPropertyOptional({ description: 'Advanced security', example: false })
  @IsOptional()
  @IsBoolean()
  advancedSecurity?: boolean;
}

// Limits DTO
export class TenantLimitsDto {
  @ApiPropertyOptional({ description: 'Maximum users', example: 50 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  maxUsers?: number;

  @ApiPropertyOptional({ description: 'Maximum students', example: 500 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  maxStudents?: number;

  @ApiPropertyOptional({ description: 'Maximum staff', example: 100 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  maxStaff?: number;

  @ApiPropertyOptional({ description: 'Maximum classes', example: 50 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  maxClasses?: number;

  @ApiPropertyOptional({ description: 'Maximum subjects', example: 100 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  maxSubjects?: number;

  @ApiPropertyOptional({ description: 'Storage quota in GB', example: 25 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  storageQuota?: number;

  @ApiPropertyOptional({ description: 'Monthly API calls', example: 10000 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  monthlyApiCalls?: number;

  @ApiPropertyOptional({ description: 'Daily email limit', example: 1000 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  dailyEmailLimit?: number;

  @ApiPropertyOptional({ description: 'Concurrent sessions', example: 100 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  concurrentSessions?: number;
}

// Main CreateTenantDto class
export class CreateTenantDto {
  // Basic information
  @ApiProperty({
    description: 'Tenant name',
    example: 'Springfield Elementary School',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  name: string;

  @ApiProperty({
    description: 'Tenant slug (URL-friendly identifier)',
    example: 'springfield-elementary',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @ApiProperty({
    description: 'Display name',
    example: 'Springfield Elementary',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  displayName: string;

  @ApiProperty({
    description: 'Tenant description',
    example:
      'A prestigious elementary school serving grades K-5 in Springfield',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  description: string;

  // Contact information
  @ApiProperty({
    description: 'Contact information',
    type: TenantContactInfoDto,
  })
  @ValidateNested()
  @Type(() => TenantContactInfoDto)
  contactInfo: TenantContactInfoDto;

  // Location
  @ApiProperty({
    description: 'Location information',
    type: TenantLocationDto,
  })
  @ValidateNested()
  @Type(() => TenantLocationDto)
  location: TenantLocationDto;

  // School information
  @ApiProperty({
    description: 'School information',
    type: SchoolInfoDto,
  })
  @ValidateNested()
  @Type(() => SchoolInfoDto)
  schoolInfo: SchoolInfoDto;

  // Subscription
  @ApiProperty({
    description: 'Subscription plan',
    enum: SubscriptionPlan,
    example: SubscriptionPlan.PROFESSIONAL,
  })
  @IsEnum(SubscriptionPlan)
  subscriptionPlan: SubscriptionPlan;

  @ApiProperty({
    description: 'Billing cycle',
    enum: BillingCycle,
    example: BillingCycle.ANNUAL,
  })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  // Configuration
  @ApiPropertyOptional({
    description: 'Feature configuration',
    type: TenantFeaturesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TenantFeaturesDto)
  features?: TenantFeaturesDto;

  @ApiPropertyOptional({
    description: 'Limit configuration',
    type: TenantLimitsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TenantLimitsDto)
  limits?: TenantLimitsDto;

  // Compliance
  @ApiPropertyOptional({
    description: 'Compliance requirements',
    example: ['gdpr', 'ferpa', 'coppa'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  complianceRequirements?: string[];

  // Tags
  @ApiPropertyOptional({
    description: 'Tags for categorization',
    example: ['elementary', 'public', 'urban'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  // Additional metadata
  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { founded: '1985', principalName: 'John Smith' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
