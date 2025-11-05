import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsEmail,
  IsUrl,
  IsArray,
  IsNumber,
  IsBoolean,
  IsDateString,
  ValidateNested,
  IsInt,
  IsPositive,
  Length,
  Matches,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTenantDto } from './create-tenant.dto';
import { TenantStatus, TenantLifecycleStage } from '../entities/tenant.entity';
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

// Update DTOs for nested entities
export class UpdateCoordinatesDto {
  @ApiPropertyOptional({ description: 'Latitude coordinate', example: 39.7817 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude coordinate',
    example: -89.6501,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class UpdateAddressDto {
  @ApiPropertyOptional({
    description: 'Street address line 1',
    example: '123 Main Street',
  })
  @IsOptional()
  @IsString()
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

  @ApiPropertyOptional({ description: 'City', example: 'Springfield' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  city?: string;

  @ApiPropertyOptional({
    description: 'State or province',
    example: 'Illinois',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  state?: string;

  @ApiPropertyOptional({ description: 'Postal or ZIP code', example: '62704' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Country', example: 'United States' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  country?: string;

  @ApiPropertyOptional({
    description: 'Coordinates',
    type: UpdateCoordinatesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCoordinatesDto)
  coordinates?: UpdateCoordinatesDto;
}

export class UpdateContactPersonDto {
  @ApiPropertyOptional({
    description: 'Contact person name',
    example: 'John Smith',
  })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  name?: string;

  @ApiPropertyOptional({
    description: 'Contact person title',
    example: 'Principal',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @ApiPropertyOptional({
    description: 'Contact person email',
    example: 'john.smith@springfield-elem.edu',
  })
  @IsOptional()
  @IsEmail()
  @Length(1, 255)
  email?: string;

  @ApiPropertyOptional({
    description: 'Contact person phone',
    example: '+1-555-0123',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  phone?: string;

  @ApiPropertyOptional({ description: 'Department', example: 'Administration' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  department?: string;
}

export class UpdateTenantContactInfoDto {
  @ApiPropertyOptional({
    description: 'Primary contact',
    type: UpdateContactPersonDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateContactPersonDto)
  primaryContact?: UpdateContactPersonDto;

  @ApiPropertyOptional({
    description: 'Billing contact',
    type: UpdateContactPersonDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateContactPersonDto)
  billingContact?: UpdateContactPersonDto;

  @ApiPropertyOptional({
    description: 'Technical contact',
    type: UpdateContactPersonDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateContactPersonDto)
  technicalContact?: UpdateContactPersonDto;

  @ApiPropertyOptional({
    description: 'Emergency contact',
    type: UpdateContactPersonDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateContactPersonDto)
  emergencyContact?: UpdateContactPersonDto;

  @ApiPropertyOptional({
    description: 'Primary phone number',
    example: '+1-555-0123',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Primary email',
    example: 'admin@springfield-elem.edu',
  })
  @IsOptional()
  @IsEmail()
  @Length(1, 255)
  email?: string;

  @ApiPropertyOptional({
    description: 'Website URL',
    example: 'https://springfield-elem.edu',
  })
  @IsOptional()
  @IsUrl()
  @Length(1, 255)
  website?: string;

  @ApiPropertyOptional({ description: 'Address', type: UpdateAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address?: UpdateAddressDto;
}

export class UpdateTenantLocationDto {
  @ApiPropertyOptional({ description: 'Timezone', example: 'America/Chicago' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  timezone?: string;

  @ApiPropertyOptional({ description: 'Locale', example: 'en_US' })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  locale?: string;

  @ApiPropertyOptional({ description: 'Currency code', example: 'USD' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @ApiPropertyOptional({ description: 'Region', example: 'North America' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  region?: string;

  @ApiPropertyOptional({ description: 'Country', example: 'United States' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  country?: string;

  @ApiPropertyOptional({ description: 'Address', type: UpdateAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address?: UpdateAddressDto;
}

export class UpdateAccreditationInfoDto {
  @ApiPropertyOptional({
    description: 'Accrediting body',
    example: 'State Board of Education',
  })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  body?: string;

  @ApiPropertyOptional({
    description: 'Accreditation status',
    enum: ['accredited', 'pending', 'expired', 'denied'],
    example: 'accredited',
  })
  @IsOptional()
  @IsEnum(['accredited', 'pending', 'expired', 'denied'])
  status?: 'accredited' | 'pending' | 'expired' | 'denied';

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

export class UpdateSchoolInfoDto {
  @ApiPropertyOptional({
    description: 'School type',
    enum: SchoolType,
    example: SchoolType.PUBLIC,
  })
  @IsOptional()
  @IsEnum(SchoolType)
  type?: SchoolType;

  @ApiPropertyOptional({
    description: 'School category',
    enum: SchoolCategory,
    example: SchoolCategory.ELEMENTARY,
  })
  @IsOptional()
  @IsEnum(SchoolCategory)
  category?: SchoolCategory;

  @ApiPropertyOptional({
    description: 'Education levels offered',
    enum: EducationLevel,
    isArray: true,
    example: [EducationLevel.KINDERGARTEN, EducationLevel.ELEMENTARY],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(EducationLevel, { each: true })
  levels?: EducationLevel[];

  @ApiPropertyOptional({
    description: 'Year the school was founded',
    example: 1985,
  })
  @IsOptional()
  @IsInt()
  foundedYear?: number;

  @ApiPropertyOptional({ description: 'Principal name', example: 'John Smith' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  principalName?: string;

  @ApiPropertyOptional({ description: 'Student capacity', example: 500 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  studentCapacity?: number;

  @ApiPropertyOptional({ description: 'Current enrollment', example: 425 })
  @IsOptional()
  @IsInt()
  currentEnrollment?: number;

  @ApiPropertyOptional({ description: 'Staff count', example: 45 })
  @IsOptional()
  @IsInt()
  staffCount?: number;

  @ApiPropertyOptional({
    description: 'Accreditation information',
    type: [UpdateAccreditationInfoDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAccreditationInfoDto)
  accreditation?: UpdateAccreditationInfoDto[];

  @ApiPropertyOptional({
    description: 'Academic calendar type',
    enum: AcademicCalendarType,
    example: AcademicCalendarType.SEMESTER,
  })
  @IsOptional()
  @IsEnum(AcademicCalendarType)
  academicCalendar?: AcademicCalendarType;

  @ApiPropertyOptional({
    description: 'Languages offered',
    example: ['English', 'Spanish', 'French'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languagesOffered?: string[];

  @ApiPropertyOptional({
    description: 'Special programs',
    example: ['STEM', 'Arts', 'Sports'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialPrograms?: string[];
}

export class UpdateTenantFeaturesDto {
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

export class UpdateTenantLimitsDto {
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

// Main UpdateTenantDto class
export class UpdateTenantDto extends PartialType(CreateTenantDto) {
  // Basic information - inherited from CreateTenantDto as optional
  @ApiPropertyOptional({
    description: 'Tenant name',
    example: 'Springfield Elementary School',
  })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  name?: string;

  @ApiPropertyOptional({
    description: 'Tenant slug',
    example: 'springfield-elementary',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Display name',
    example: 'Springfield Elementary',
  })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  displayName?: string;

  @ApiPropertyOptional({ description: 'Tenant description' })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  description?: string;

  // Additional fields not in CreateTenantDto
  @ApiPropertyOptional({
    description: 'Tenant status',
    enum: TenantStatus,
    example: TenantStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @ApiPropertyOptional({
    description: 'Tenant lifecycle stage',
    enum: TenantLifecycleStage,
    example: TenantLifecycleStage.ACTIVE,
  })
  @IsOptional()
  @IsEnum(TenantLifecycleStage)
  lifecycleStage?: TenantLifecycleStage;

  // Nested entities - inherited from CreateTenantDto as optional
  //   @ApiPropertyOptional({
  //     description: 'Contact information',
  //     type: UpdateTenantContactInfoDto,
  //   })
  //   @IsOptional()
  //   @ValidateNested()
  //   @Type(() => UpdateTenantContactInfoDto)
  //   contactInfo?: UpdateTenantContactInfoDto;

  //   @ApiPropertyOptional({
  //     description: 'Location information',
  //     type: UpdateTenantLocationDto,
  //   })
  //   @IsOptional()
  //   @ValidateNested()
  //   @Type(() => UpdateTenantLocationDto)
  //   location?: UpdateTenantLocationDto;

  //   @ApiPropertyOptional({
  //     description: 'School information',
  //     type: UpdateSchoolInfoDto,
  //   })
  //   @IsOptional()
  //   @ValidateNested()
  //   @Type(() => UpdateSchoolInfoDto)
  //   schoolInfo?: UpdateSchoolInfoDto;

  @ApiPropertyOptional({
    description: 'Subscription plan',
    enum: SubscriptionPlan,
    example: SubscriptionPlan.PROFESSIONAL,
  })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  subscriptionPlan?: SubscriptionPlan;

  @ApiPropertyOptional({
    description: 'Billing cycle',
    enum: BillingCycle,
    example: BillingCycle.ANNUAL,
  })
  @IsOptional()
  @IsEnum(BillingCycle)
  billingCycle?: BillingCycle;

  @ApiPropertyOptional({
    description: 'Feature configuration',
    type: UpdateTenantFeaturesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateTenantFeaturesDto)
  features?: UpdateTenantFeaturesDto;

  @ApiPropertyOptional({
    description: 'Limit configuration',
    type: UpdateTenantLimitsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateTenantLimitsDto)
  limits?: UpdateTenantLimitsDto;

  @ApiPropertyOptional({
    description: 'Compliance requirements',
    example: ['gdpr', 'ferpa', 'coppa'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  complianceRequirements?: string[];

  @ApiPropertyOptional({
    description: 'Tags for categorization',
    example: ['elementary', 'public', 'urban'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { founded: '1985', principalName: 'John Smith' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
