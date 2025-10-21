import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TenantStatus,
  TenantLifecycleStage,
  Tenant,
} from '../entities/tenant.entity';
import {
  SchoolType,
  SchoolCategory,
  EducationLevel,
  AcademicCalendarType,
} from '../entities/school-info.entity';
import {
  SubscriptionPlan,
  SubscriptionStatus,
  BillingCycle,
} from '../entities/tenant-subscription.entity';

// Response DTOs for nested entities
export class CoordinatesResponseDto {
  @ApiProperty({ description: 'Latitude coordinate', example: 39.7817 })
  latitude: number;

  @ApiProperty({ description: 'Longitude coordinate', example: -89.6501 })
  longitude: number;
}

export class AddressResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({
    description: 'Street address line 1',
    example: '123 Main Street',
  })
  street1: string;

  @ApiPropertyOptional({
    description: 'Street address line 2',
    example: 'Suite 100',
  })
  street2?: string;

  @ApiProperty({ description: 'City', example: 'Springfield' })
  city: string;

  @ApiProperty({ description: 'State or province', example: 'Illinois' })
  state: string;

  @ApiProperty({ description: 'Postal or ZIP code', example: '62704' })
  postalCode: string;

  @ApiProperty({ description: 'Country', example: 'United States' })
  country: string;

  @ApiPropertyOptional({ description: 'Latitude coordinate', example: 39.7817 })
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude coordinate',
    example: -89.6501,
  })
  longitude?: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: string;
}

export class ContactPersonResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Contact person name', example: 'John Smith' })
  name: string;

  @ApiProperty({ description: 'Contact person title', example: 'Principal' })
  title: string;

  @ApiProperty({
    description: 'Contact person email',
    example: 'john.smith@springfield-elem.edu',
  })
  email: string;

  @ApiProperty({ description: 'Contact person phone', example: '+1-555-0123' })
  phone: string;

  @ApiPropertyOptional({ description: 'Department', example: 'Administration' })
  department?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: string;
}

export class TenantContactInfoResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({
    description: 'Primary contact',
    type: ContactPersonResponseDto,
  })
  primaryContact: ContactPersonResponseDto;

  @ApiPropertyOptional({
    description: 'Billing contact',
    type: ContactPersonResponseDto,
  })
  billingContact?: ContactPersonResponseDto;

  @ApiPropertyOptional({
    description: 'Technical contact',
    type: ContactPersonResponseDto,
  })
  technicalContact?: ContactPersonResponseDto;

  @ApiPropertyOptional({
    description: 'Emergency contact',
    type: ContactPersonResponseDto,
  })
  emergencyContact?: ContactPersonResponseDto;

  @ApiProperty({ description: 'Primary phone number', example: '+1-555-0123' })
  phone: string;

  @ApiProperty({
    description: 'Primary email',
    example: 'admin@springfield-elem.edu',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Website URL',
    example: 'https://springfield-elem.edu',
  })
  website?: string;

  @ApiProperty({ description: 'Address', type: AddressResponseDto })
  address: AddressResponseDto;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: string;
}

export class TenantLocationResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Timezone', example: 'America/Chicago' })
  timezone: string;

  @ApiProperty({ description: 'Locale', example: 'en_US' })
  locale: string;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Region', example: 'North America' })
  region: string;

  @ApiProperty({ description: 'Country', example: 'United States' })
  country: string;

  @ApiProperty({ description: 'Address', type: AddressResponseDto })
  address: AddressResponseDto;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: string;
}

export class AccreditationInfoResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({
    description: 'Accrediting body',
    example: 'State Board of Education',
  })
  body: string;

  @ApiProperty({
    description: 'Accreditation status',
    enum: ['accredited', 'pending', 'expired', 'denied'],
    example: 'accredited',
  })
  status: 'accredited' | 'pending' | 'expired' | 'denied';

  @ApiPropertyOptional({ description: 'Expiry date', example: '2025-12-31' })
  expiryDate?: string;

  @ApiPropertyOptional({
    description: 'Certificate number',
    example: 'ACC-2024-001',
  })
  certificateNumber?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: string;
}

export class SchoolInfoResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({
    description: 'School type',
    enum: SchoolType,
    example: SchoolType.PUBLIC,
  })
  type: SchoolType;

  @ApiProperty({
    description: 'School category',
    enum: SchoolCategory,
    example: SchoolCategory.ELEMENTARY,
  })
  category: SchoolCategory;

  @ApiProperty({
    description: 'Education levels offered',
    enum: EducationLevel,
    isArray: true,
    example: [EducationLevel.KINDERGARTEN, EducationLevel.ELEMENTARY],
  })
  levels: EducationLevel[];

  @ApiPropertyOptional({
    description: 'Year the school was founded',
    example: 1985,
  })
  foundedYear?: number;

  @ApiPropertyOptional({ description: 'Principal name', example: 'John Smith' })
  principalName?: string;

  @ApiProperty({ description: 'Student capacity', example: 500 })
  studentCapacity: number;

  @ApiProperty({ description: 'Current enrollment', example: 425 })
  currentEnrollment: number;

  @ApiProperty({ description: 'Staff count', example: 45 })
  staffCount: number;

  @ApiProperty({
    description: 'Academic calendar type',
    enum: AcademicCalendarType,
    example: AcademicCalendarType.SEMESTER,
  })
  academicCalendar: AcademicCalendarType;

  @ApiProperty({
    description: 'Languages offered',
    example: ['English', 'Spanish', 'French'],
  })
  languagesOffered: string[];

  @ApiPropertyOptional({
    description: 'Special programs',
    example: ['STEM', 'Arts', 'Sports'],
  })
  specialPrograms?: string[];

  @ApiProperty({
    description: 'Accreditation information',
    type: [AccreditationInfoResponseDto],
  })
  accreditation: AccreditationInfoResponseDto[];

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: string;
}

export class FeatureLimitsResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Custom branding allowed', example: true })
  customBranding: boolean;

  @ApiProperty({ description: 'API access allowed', example: true })
  apiAccess: boolean;

  @ApiProperty({ description: 'SSO integration allowed', example: true })
  ssoIntegration: boolean;

  @ApiProperty({ description: 'Advanced reports allowed', example: true })
  advancedReports: boolean;

  @ApiProperty({ description: 'Mobile app access', example: true })
  mobileApp: boolean;

  @ApiProperty({ description: 'Parent portal access', example: true })
  parentPortal: boolean;

  @ApiProperty({ description: 'Student portal access', example: true })
  studentPortal: boolean;

  @ApiProperty({ description: 'Bulk operations allowed', example: true })
  bulkOperations: boolean;

  @ApiProperty({ description: 'Data export allowed', example: true })
  dataExport: boolean;

  @ApiProperty({ description: 'Automated backups', example: true })
  automatedBackups: boolean;

  @ApiProperty({ description: 'Priority support', example: true })
  prioritySupport: boolean;

  @ApiProperty({ description: 'Dedicated account manager', example: false })
  dedicatedAccountManager: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: string;
}

export class SubscriptionLimitsResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Maximum users', example: 100 })
  maxUsers: number;

  @ApiProperty({ description: 'Maximum students', example: 500 })
  maxStudents: number;

  @ApiProperty({ description: 'Maximum storage in GB', example: 50 })
  maxStorage: number;

  @ApiProperty({ description: 'Maximum API calls per month', example: 10000 })
  maxApiCalls: number;

  @ApiProperty({ description: 'Maximum school years', example: 5 })
  maxSchoolYears: number;

  @ApiProperty({ description: 'Maximum classes', example: 50 })
  maxClasses: number;

  @ApiProperty({
    description: 'Feature limits',
    type: FeatureLimitsResponseDto,
  })
  features: FeatureLimitsResponseDto;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: string;
}

export class BillingInfoResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Payment method', example: 'credit_card' })
  method: string;

  @ApiProperty({ description: 'Billing status', example: 'current' })
  status: string;

  @ApiProperty({
    description: 'Next billing date',
    example: '2024-02-01T00:00:00.000Z',
  })
  nextBillingDate: string;

  @ApiPropertyOptional({
    description: 'Last payment date',
    example: '2024-01-01T00:00:00.000Z',
  })
  lastPaymentDate?: string;

  @ApiPropertyOptional({ description: 'Last payment amount', example: 199.99 })
  lastPaymentAmount?: number;

  @ApiProperty({ description: 'Outstanding balance', example: 0.0 })
  outstandingBalance: number;

  @ApiPropertyOptional({ description: 'Payment details (partial)' })
  paymentDetails?: {
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };

  @ApiProperty({ description: 'Invoice IDs', example: ['inv_001', 'inv_002'] })
  invoices: string[];

  @ApiPropertyOptional({
    description: 'Billing address',
    type: AddressResponseDto,
  })
  billingAddress?: AddressResponseDto;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: string;
}

export class TrialInfoResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({ description: 'Is trial currently active', example: true })
  isTrialActive: boolean;

  @ApiProperty({
    description: 'Trial start date',
    example: '2024-01-01T00:00:00.000Z',
  })
  trialStartDate: string;

  @ApiProperty({
    description: 'Trial end date',
    example: '2024-01-31T23:59:59.000Z',
  })
  trialEndDate: string;

  @ApiProperty({ description: 'Trial days remaining', example: 15 })
  trialDaysRemaining: number;

  @ApiProperty({
    description: 'Trial plan',
    enum: SubscriptionPlan,
    example: SubscriptionPlan.PROFESSIONAL,
  })
  trialPlan: SubscriptionPlan;

  @ApiProperty({ description: 'Converted from trial', example: false })
  convertedFromTrial: boolean;

  @ApiProperty({ description: 'Extensions used', example: 0 })
  extensionsUsed: number;

  @ApiProperty({ description: 'Maximum extensions allowed', example: 2 })
  maxExtensions: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: string;
}

export class TenantSubscriptionResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({
    description: 'Subscription plan',
    enum: SubscriptionPlan,
    example: SubscriptionPlan.PROFESSIONAL,
  })
  plan: SubscriptionPlan;

  @ApiProperty({
    description: 'Subscription status',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @ApiProperty({
    description: 'Billing cycle',
    enum: BillingCycle,
    example: BillingCycle.ANNUAL,
  })
  billingCycle: BillingCycle;

  @ApiProperty({
    description: 'Subscription start date',
    example: '2024-01-01T00:00:00.000Z',
  })
  startDate: string;

  @ApiPropertyOptional({
    description: 'Subscription end date',
    example: '2024-12-31T23:59:59.000Z',
  })
  endDate?: string;

  @ApiProperty({
    description: 'Renewal date',
    example: '2024-12-31T23:59:59.000Z',
  })
  renewalDate: string;

  @ApiProperty({ description: 'Base price', example: 99.99 })
  basePrice: number;

  @ApiProperty({ description: 'Additional user price', example: 5.99 })
  additionalUserPrice: number;

  @ApiProperty({ description: 'Total price', example: 199.99 })
  totalPrice: number;

  @ApiProperty({ description: 'Currency', example: 'USD' })
  currency: string;

  @ApiPropertyOptional({ description: 'Discount information' })
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    code?: string;
    validUntil?: string;
    reason?: string;
  };

  @ApiProperty({ description: 'Usage tracking enabled', example: true })
  usageTracking: boolean;

  @ApiProperty({ description: 'Overage charges enabled', example: false })
  overageCharges: boolean;

  @ApiProperty({
    description: 'Subscription limits',
    type: SubscriptionLimitsResponseDto,
  })
  limits: SubscriptionLimitsResponseDto;

  @ApiProperty({
    description: 'Billing information',
    type: BillingInfoResponseDto,
  })
  billing: BillingInfoResponseDto;

  @ApiPropertyOptional({
    description: 'Trial information',
    type: TrialInfoResponseDto,
  })
  trial?: TrialInfoResponseDto;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: string;
}

// Main TenantResponseDto
export class TenantResponseDto {
  @ApiProperty({ description: 'Unique identifier' })
  id: string;

  @ApiProperty({
    description: 'Tenant name',
    example: 'Springfield Elementary School',
  })
  name: string;

  @ApiProperty({
    description: 'Tenant slug',
    example: 'springfield-elementary',
  })
  slug: string;

  @ApiPropertyOptional({
    description: 'Display name',
    example: 'Springfield Elementary',
  })
  displayName?: string;

  @ApiPropertyOptional({ description: 'Tenant description' })
  description?: string;

  @ApiProperty({
    description: 'Tenant status',
    enum: TenantStatus,
    example: TenantStatus.ACTIVE,
  })
  status: TenantStatus;

  @ApiProperty({
    description: 'Tenant lifecycle stage',
    enum: TenantLifecycleStage,
    example: TenantLifecycleStage.ACTIVE,
  })
  lifecycleStage: TenantLifecycleStage;

  @ApiProperty({
    description: 'Tags',
    example: ['elementary', 'public', 'urban'],
  })
  tags: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Contact information',
    type: TenantContactInfoResponseDto,
  })
  contactInfo: TenantContactInfoResponseDto;

  @ApiProperty({
    description: 'Location information',
    type: TenantLocationResponseDto,
  })
  location: TenantLocationResponseDto;

  @ApiProperty({
    description: 'School information',
    type: SchoolInfoResponseDto,
  })
  schoolInfo: SchoolInfoResponseDto;

  @ApiProperty({
    description: 'Subscription information',
    type: TenantSubscriptionResponseDto,
  })
  subscription: TenantSubscriptionResponseDto;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: string;

  @ApiPropertyOptional({ description: 'Deletion timestamp' })
  deletedAt?: string;

  // Computed properties
  @ApiProperty({ description: 'Is tenant active', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Is trial active', example: false })
  isTrialActive: boolean;

  @ApiPropertyOptional({ description: 'Days until renewal', example: 45 })
  daysUntilRenewal?: number;

  @ApiProperty({ description: 'Is expiring soon', example: false })
  isExpiringSoon: boolean;

  @ApiProperty({ description: 'Utilization percentage', example: 65.5 })
  utilizationPercentage: number;

  @ApiProperty({ description: 'Health score (0-100)', example: 92.5 })
  healthScore: number;

  static fromEntity(tenant: Tenant): TenantResponseDto {
    // Implementation would map entity to DTO
    const dto = new TenantResponseDto();
    // ... mapping logic
    dto.id = tenant.id;
    dto.name = tenant.name;
    dto.slug = tenant.slug;
    dto.displayName = tenant.displayName;
    dto.description = tenant.description;
    dto.status = tenant.status;
    dto.lifecycleStage = tenant.lifecycleStage;
    dto.tags = tenant.tags;
    dto.metadata = tenant.metadata;
    // dto.contactInfo = tenant.contactInfo;
    // dto.location;
    // dto.schoolInfo;
    // dto.subscription;
    // dto.createdAt;
    // dto.updatedAt;
    // dto.deletedAt;
    // dto.isActive;
    // dto.isTrialActive;
    // dto.daysUntilRenewal;
    // dto.isExpiringSoon;
    // dto.utilizationPercentage;
    // dto.healthScore;
    return dto;
  }
}

/**
 * Simplified tenant summary DTO for search and listing
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

  @ApiProperty({ description: 'Tenant code', example: 'SPR-ELEM' })
  code: string;

  @ApiProperty({ description: 'Tenant type', example: 'school' })
  type: string;

  @ApiProperty({
    description: 'Tenant status',
    enum: TenantStatus,
    example: TenantStatus.ACTIVE,
  })
  status: TenantStatus;

  @ApiPropertyOptional({
    description: 'Primary email',
    example: 'admin@springfield-elem.edu',
  })
  email?: string;

  @ApiPropertyOptional({ description: 'Primary phone', example: '+1-555-0123' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Logo URL',
    example: 'https://cdn.example.com/logo.png',
  })
  logoUrl?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  static fromEntity(tenant: Tenant): TenantSummaryDto {
    const dto = new TenantSummaryDto();
    dto.id = tenant.id;
    dto.name = tenant.name;
    dto.code = tenant.slug;
    dto.status = tenant.status;
    dto.email = tenant.contactInfo?.email;
    dto.phone = tenant.contactInfo?.phone;
    dto.logoUrl = tenant.branding?.logoUrl;
    dto.createdAt = tenant.createdAt;
    return dto;
  }

  static fromEntities(tenants: any[]): TenantSummaryDto[] {
    return tenants.map((tenant) => this.fromEntity(tenant));
  }
}
