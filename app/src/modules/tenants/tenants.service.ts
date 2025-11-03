import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DataSource,
  QueryRunner,
  SelectQueryBuilder,
} from 'typeorm';
import {
  Tenant,
  TenantStatus,
  TenantLifecycleStage,
} from './entities/tenant.entity';
import { TenantContactInfo } from './entities/contact-info.entity';
import { ContactPerson } from './entities/contact-person.entity';
import { Address } from './entities/address.entity';
import { TenantLocation } from './entities/tenant-location.entity';
import {
  AcademicCalendarType,
  SchoolCategory,
  SchoolInfo,
  SchoolType,
} from './entities/school-info.entity';
import { AccreditationInfo } from './entities/accreditation-info.entity';
import {
  TenantSubscription,
  SubscriptionPlan,
  SubscriptionStatus,
  BillingCycle,
} from './entities/tenant-subscription.entity';
import { SubscriptionLimits } from './entities/subscription-limits.entity';
import { FeatureLimits } from './entities/feature-limits.entity';
import {
  BillingInfo,
  BillingStatus,
  PaymentMethod,
} from './entities/billing-info.entity';
import { TrialInfo } from './entities/trial-info.entity';
import { TenantConfiguration } from './entities/tenant-configuration.entity';
import {
  BackupFrequency,
  SystemSettings,
} from './entities/system-settings.entity';
import { PasswordPolicy } from './entities/password-policy.entity';
import { TenantFeatures } from './entities/tenant-features.entity';
import { TenantLimits } from './entities/tenant-limits.entity';
import { TenantCustomizations } from './entities/tenant-customizations.entity';
import { ApiSettings } from './entities/api-settings.entity';
import { ComplianceInfo } from './entities/compliance-info.entity';
import { ComplianceCertification } from './entities/compliance-certification.entity';
import { SecuritySettings } from './entities/security-settings.entity';
import { SecurityIncident } from './entities/security-incident.entity';
import { TenantUsage } from './entities/tenant-usage.entity';
import { TenantBranding } from './entities/tenant-branding.entity';
import { TenantIntegrations } from './entities/tenant-integrations.entity';
import { LmsIntegration } from './entities/lms-integration.entity';
import { PaymentGatewayIntegration } from './entities/payment-gateway-integration.entity';
import { CommunicationIntegration } from './entities/communication-integration.entity';
import { AnalyticsIntegration } from './entities/analytics-integration.entity';
import { SsoIntegration } from './entities/sso-integration.entity';
import { CustomIntegration } from './entities/custom-integration.entity';
import { User, UserRole } from '../users/entities/user.entity';
import {
  AccreditationInfoDto,
  AddressDto,
  ContactPersonDto,
  CreateTenantDto,
} from './dto/create-tenant.dto';
import {
  UpdateTenantContactInfoDto,
  UpdateTenantDto,
  UpdateTenantLocationDto,
} from './dto/update-tenant.dto';
import { TenantQueryDto } from './dto/tenant-query.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { CreateTenantMinimalDto } from './dto/create-tenant-minimal.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(TenantContactInfo)
    private readonly contactInfoRepository: Repository<TenantContactInfo>,
    @InjectRepository(ContactPerson)
    private readonly contactPersonRepository: Repository<ContactPerson>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(TenantLocation)
    private readonly locationRepository: Repository<TenantLocation>,
    @InjectRepository(SchoolInfo)
    private readonly schoolInfoRepository: Repository<SchoolInfo>,
    @InjectRepository(AccreditationInfo)
    private readonly accreditationRepository: Repository<AccreditationInfo>,
    @InjectRepository(TenantSubscription)
    private readonly subscriptionRepository: Repository<TenantSubscription>,
    @InjectRepository(SubscriptionLimits)
    private readonly subscriptionLimitsRepository: Repository<SubscriptionLimits>,
    @InjectRepository(FeatureLimits)
    private readonly featureLimitsRepository: Repository<FeatureLimits>,
    @InjectRepository(BillingInfo)
    private readonly billingInfoRepository: Repository<BillingInfo>,
    @InjectRepository(TrialInfo)
    private readonly trialInfoRepository: Repository<TrialInfo>,
    @InjectRepository(TenantConfiguration)
    private readonly configurationRepository: Repository<TenantConfiguration>,
    @InjectRepository(SystemSettings)
    private readonly systemSettingsRepository: Repository<SystemSettings>,
    @InjectRepository(PasswordPolicy)
    private readonly passwordPolicyRepository: Repository<PasswordPolicy>,
    @InjectRepository(TenantFeatures)
    private readonly tenantFeaturesRepository: Repository<TenantFeatures>,
    @InjectRepository(TenantLimits)
    private readonly tenantLimitsRepository: Repository<TenantLimits>,
    @InjectRepository(TenantCustomizations)
    private readonly customizationsRepository: Repository<TenantCustomizations>,
    @InjectRepository(ApiSettings)
    private readonly apiSettingsRepository: Repository<ApiSettings>,
    @InjectRepository(ComplianceInfo)
    private readonly complianceRepository: Repository<ComplianceInfo>,
    @InjectRepository(ComplianceCertification)
    private readonly certificationRepository: Repository<ComplianceCertification>,
    @InjectRepository(SecuritySettings)
    private readonly securityRepository: Repository<SecuritySettings>,
    @InjectRepository(SecurityIncident)
    private readonly securityIncidentRepository: Repository<SecurityIncident>,
    @InjectRepository(TenantUsage)
    private readonly usageRepository: Repository<TenantUsage>,
    @InjectRepository(TenantBranding)
    private readonly brandingRepository: Repository<TenantBranding>,
    @InjectRepository(TenantIntegrations)
    private readonly integrationsRepository: Repository<TenantIntegrations>,
    @InjectRepository(LmsIntegration)
    private readonly lmsIntegrationRepository: Repository<LmsIntegration>,
    @InjectRepository(PaymentGatewayIntegration)
    private readonly paymentGatewayRepository: Repository<PaymentGatewayIntegration>,
    @InjectRepository(CommunicationIntegration)
    private readonly communicationIntegrationRepository: Repository<CommunicationIntegration>,
    @InjectRepository(AnalyticsIntegration)
    private readonly analyticsIntegrationRepository: Repository<AnalyticsIntegration>,
    @InjectRepository(SsoIntegration)
    private readonly ssoIntegrationRepository: Repository<SsoIntegration>,
    @InjectRepository(CustomIntegration)
    private readonly customIntegrationRepository: Repository<CustomIntegration>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async findByCode(code: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { slug: code },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }

  async findByDomain(domain: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { contactInfo: { website: domain } },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }

  async create(createDto: CreateTenantDto): Promise<Tenant> {
    // Check for unique constraints
    await this.validateUniqueFields(createDto);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create all nested entities
      const tenant = await this.createTenantWithRelations(
        createDto,
        queryRunner,
      );

      await queryRunner.commitTransaction();

      // Return tenant with all relations loaded
      return this.findOne(tenant.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to create tenant: ${error}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: TenantQueryDto): Promise<PaginatedResponseDto<Tenant>> {
    const queryBuilder = this.tenantRepository.createQueryBuilder('tenant');

    // Load all relations
    this.addRelations(queryBuilder);

    // Apply filters
    this.applyFilters(queryBuilder, query);

    // Apply search
    if (query.search) {
      queryBuilder.andWhere(
        `(
          tenant.name ILIKE :search OR 
          tenant.slug ILIKE :search OR 
          tenant.displayName ILIKE :search OR 
          contactInfo.email ILIKE :search OR
          contactInfo.phone ILIKE :search OR
          schoolInfo.principalName ILIKE :search
        )`,
        { search: `%${query.search}%` },
      );
    }

    // Apply sorting
    const sortField = `tenant.${query.sortBy}`;
    queryBuilder.orderBy(sortField, query.sortDirection);

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // const skip = (query.page - 1) * query.limit;
    queryBuilder.skip(skip).take(query.limit);

    const tenants = await queryBuilder.getMany();

    return new PaginatedResponseDto(tenants, total, page, limit);
  }

  async findOne(id: string): Promise<Tenant> {
    const queryBuilder = this.tenantRepository.createQueryBuilder('tenant');
    this.addRelations(queryBuilder);

    const tenant = await queryBuilder.where('tenant.id = :id', { id }).getOne();

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async findBySlug(slug: string): Promise<Tenant> {
    const queryBuilder = this.tenantRepository.createQueryBuilder('tenant');
    this.addRelations(queryBuilder);

    const tenant = await queryBuilder
      .where('tenant.slug = :slug', { slug })
      .getOne();

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async update(id: string, updateDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);

    // Check for unique constraints if fields are being updated
    await this.validateUniqueFields(updateDto, id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.updateTenantWithRelations(tenant, updateDto, queryRunner);

      await queryRunner.commitTransaction();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to update tenant: ${error}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const tenant = await this.findOne(id);

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Soft delete - the cascade should handle related entities
    await this.tenantRepository.softDelete(id);
  }

  async restore(id: string): Promise<Tenant> {
    // Restore soft-deleted tenant
    await this.tenantRepository.restore(id);
    return this.findOne(id);
  }

  async toggleStatus(id: string): Promise<Tenant> {
    const tenant = await this.findOne(id);

    // Toggle between active and inactive
    if (tenant.status === TenantStatus.ACTIVE) {
      tenant.status = TenantStatus.INACTIVE;
      tenant.lifecycleStage = TenantLifecycleStage.AT_RISK;
    } else if (tenant.status === TenantStatus.INACTIVE) {
      tenant.status = TenantStatus.ACTIVE;
      tenant.lifecycleStage = TenantLifecycleStage.ACTIVE;
    }

    return this.tenantRepository.save(tenant);
  }

  async updateSubscription(
    id: string,
    subscriptionData: {
      plan: SubscriptionPlan;
      status: SubscriptionStatus;
      billingCycle: BillingCycle;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<Tenant> {
    const tenant = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update subscription
      const updatedSubscription = Object.assign(tenant.subscription, {
        plan: subscriptionData.plan,
        status: subscriptionData.status,
        billingCycle: subscriptionData.billingCycle,
        startDate: subscriptionData.startDate || tenant.subscription.startDate,
        endDate: subscriptionData.endDate,
        renewalDate: this.calculateRenewalDate(
          subscriptionData.billingCycle,
          subscriptionData.startDate || tenant.subscription.startDate,
        ),
      });

      // Update limits based on plan
      await this.updateLimitsForPlan(
        tenant.subscription.limits,
        subscriptionData.plan,
        queryRunner,
      );

      // Update tenant status based on subscription
      tenant.status = this.getTenantStatusFromSubscription(
        subscriptionData.status,
      );
      tenant.lifecycleStage = this.getLifecycleStageFromSubscription(
        subscriptionData.status,
      );

      await queryRunner.manager.save(TenantSubscription, updatedSubscription);
      await queryRunner.manager.save(Tenant, tenant);

      await queryRunner.commitTransaction();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to update subscription: ${error}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateFeatures(
    id: string,
    features: Partial<TenantFeatures>,
  ): Promise<Tenant> {
    const tenant = await this.findOne(id);

    Object.assign(tenant.configuration.features, features);
    await this.tenantFeaturesRepository.save(tenant.configuration.features);

    return this.findOne(id);
  }

  async updateLimits(
    id: string,
    limits: Partial<TenantLimits>,
  ): Promise<Tenant> {
    const tenant = await this.findOne(id);

    Object.assign(tenant.configuration.limits, limits);
    await this.tenantLimitsRepository.save(tenant.configuration.limits);

    return this.findOne(id);
  }

  async getStatistics() {
    const queryBuilder = this.tenantRepository.createQueryBuilder('tenant');

    const [
      total,
      active,
      inactive,
      //   trial,
      suspended,
      terminated,
      //   byPlan,
      //   byLifecycleStage,
      recentlyCreated,
      trialExpiringSoon,
      subscriptionExpiringSoon,
    ] = await Promise.all([
      // Total tenants
      queryBuilder.getCount(),

      // By status
      queryBuilder
        .clone()
        .andWhere('tenant.status = :status', { status: TenantStatus.ACTIVE })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere('tenant.status = :status', { status: TenantStatus.INACTIVE })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere('tenant.lifecycleStage = :stage', {
          stage: TenantLifecycleStage.TRIAL,
        })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere('tenant.status = :status', { status: TenantStatus.SUSPENDED })
        .getCount(),
      queryBuilder
        .clone()
        .andWhere('tenant.status = :status', {
          status: TenantStatus.TERMINATED,
        })
        .getCount(),

      // By subscription plan
      queryBuilder
        .clone()
        .leftJoin('tenant.subscription', 'subscription')
        .select('subscription.plan', 'plan')
        .addSelect('COUNT(*)', 'count')
        .groupBy('subscription.plan')
        .getRawMany(),

      // By lifecycle stage
      queryBuilder
        .clone()
        .select('tenant.lifecycleStage', 'stage')
        .addSelect('COUNT(*)', 'count')
        .groupBy('tenant.lifecycleStage')
        .getRawMany(),

      // Recently created (last 30 days)
      queryBuilder
        .clone()
        .andWhere('tenant.createdAt >= :thirtyDaysAgo', {
          thirtyDaysAgo: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        })
        .getCount(),

      // Trial expiring soon (within 7 days)
      queryBuilder
        .clone()
        .leftJoin('tenant.subscription', 'subscription')
        .leftJoin('subscription.trial', 'trial')
        .andWhere('trial.isTrialActive = :active', { active: true })
        .andWhere('trial.trialEndDate BETWEEN :now AND :sevenDaysFromNow', {
          now: new Date(),
          sevenDaysFromNow: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        .getCount(),

      // Subscription expiring soon (within 30 days)
      queryBuilder
        .clone()
        .leftJoin('tenant.subscription', 'subscription')
        .andWhere(
          'subscription.renewalDate BETWEEN :now AND :thirtyDaysFromNow',
          {
            now: new Date(),
            thirtyDaysFromNow: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        )
        .getCount(),
    ]);

    // const subscriptionPlanStats = Object.values(SubscriptionPlan).reduce(
    //   (acc, plan) => {
    //     const stat = byPlan.find((item) => item.plan === plan);
    //     acc[plan] = stat ? parseInt(String(stat.count), 10) : 0;
    //     return acc;
    //   },
    //   {} as Record<SubscriptionPlan, number>,
    // );

    // const lifecycleStageStats = Object.values(TenantLifecycleStage).reduce(
    //   (acc, stage) => {
    //     const stat = byLifecycleStage.find((item) => item.stage === stage);
    //     acc[stage] = stat ? parseInt(String(stat.count), 10) : 0;
    //     return acc;
    //   },
    //   {} as Record<TenantLifecycleStage, number>,
    // );

    return {
      total,
      byStatus: {
        active,
        inactive,
        suspended,
        terminated,
        maintenance: total - active - inactive - suspended - terminated,
      },
      //   byLifecycleStage: lifecycleStageStats,
      //   bySubscriptionPlan: subscriptionPlanStats,
      recentlyCreated,
      trialExpiringSoon,
      subscriptionExpiringSoon,
    };
  }

  async getTenantsExpiringSoon(days: number = 30): Promise<Tenant[]> {
    const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const queryBuilder = this.tenantRepository.createQueryBuilder('tenant');
    this.addRelations(queryBuilder);

    return queryBuilder
      .leftJoin('tenant.subscription', 'subscription')
      .leftJoin('subscription.trial', 'trial')
      .where(
        '(trial.isTrialActive = :active AND trial.trialEndDate BETWEEN :now AND :futureDate) OR ' +
          '(subscription.renewalDate BETWEEN :now AND :futureDate)',
        {
          active: true,
          now: new Date(),
          futureDate,
        },
      )
      .getMany();
  }

  // Private helper methods

  private async validateUniqueFields(
    dto: CreateTenantDto | UpdateTenantDto,
    excludeId?: string,
  ): Promise<void> {
    const errors: string[] = [];

    if (dto.slug) {
      const existingBySlug = await this.tenantRepository.findOne({
        where: { slug: dto.slug },
      });

      if (existingBySlug && existingBySlug.id !== excludeId) {
        errors.push('Tenant with this slug already exists');
      }
    }

    if (dto.contactInfo?.email) {
      const existingByEmail = await this.contactInfoRepository.findOne({
        where: { email: dto.contactInfo.email },
      });

      if (existingByEmail && excludeId) {
        const tenant = await this.tenantRepository.findOne({
          where: { contactInfo: { id: existingByEmail.id } },
        });
        if (tenant && tenant.id !== excludeId) {
          errors.push('Tenant with this email already exists');
        }
      } else if (existingByEmail && !excludeId) {
        errors.push('Tenant with this email already exists');
      }
    }

    if (errors.length > 0) {
      throw new ConflictException(errors.join(', '));
    }
  }

  private async createTenantWithRelations(
    createDto: CreateTenantDto,
    queryRunner: QueryRunner,
  ): Promise<Tenant> {
    // Create addresses
    const contactAddress = await this.createAddress(
      createDto.contactInfo.address,
      queryRunner,
    );
    const locationAddress = await this.createAddress(
      createDto.location.address,
      queryRunner,
    );

    // Create contact persons
    const primaryContact = await this.createContactPerson(
      createDto.contactInfo.primaryContact,
      queryRunner,
    );
    const billingContact = createDto.contactInfo.billingContact
      ? await this.createContactPerson(
          createDto.contactInfo.billingContact,
          queryRunner,
        )
      : undefined;
    const technicalContact = createDto.contactInfo.technicalContact
      ? await this.createContactPerson(
          createDto.contactInfo.technicalContact,
          queryRunner,
        )
      : undefined;
    const emergencyContact = createDto.contactInfo.emergencyContact
      ? await this.createContactPerson(
          createDto.contactInfo.emergencyContact,
          queryRunner,
        )
      : undefined;

    // Create contact info
    const contactInfo = queryRunner.manager.create(TenantContactInfo, {
      primaryContact,
      billingContact,
      technicalContact,
      emergencyContact,
      phone: createDto.contactInfo.phone,
      email: createDto.contactInfo.email,
      website: createDto.contactInfo.website,
      address: contactAddress,
    });
    await queryRunner.manager.save(TenantContactInfo, contactInfo);

    // Create location
    const location = queryRunner.manager.create(TenantLocation, {
      timezone: createDto.location.timezone,
      locale: createDto.location.locale,
      currency: createDto.location.currency,
      region: createDto.location.region,
      country: createDto.location.country,
      address: locationAddress,
    });
    await queryRunner.manager.save(TenantLocation, location);

    // Create accreditation info
    const accreditations = createDto.schoolInfo.accreditation
      ? await Promise.all(
          createDto.schoolInfo.accreditation.map((acc) =>
            this.createAccreditationInfo(acc, queryRunner),
          ),
        )
      : [];

    // Create school info
    const schoolInfo = queryRunner.manager.create(SchoolInfo, {
      type: createDto.schoolInfo.type,
      category: createDto.schoolInfo.category,
      levels: createDto.schoolInfo.levels,
      foundedYear: createDto.schoolInfo.foundedYear,
      principalName: createDto.schoolInfo.principalName,
      studentCapacity: createDto.schoolInfo.studentCapacity,
      currentEnrollment: createDto.schoolInfo.currentEnrollment,
      staffCount: createDto.schoolInfo.staffCount,
      academicCalendar: createDto.schoolInfo.academicCalendar,
      languagesOffered: createDto.schoolInfo.languagesOffered,
      specialPrograms: createDto.schoolInfo.specialPrograms,
      accreditation: accreditations,
    });
    await queryRunner.manager.save(SchoolInfo, schoolInfo);

    // Create subscription and related entities
    const subscription = await this.createSubscription(createDto, queryRunner);

    // Create configuration and related entities
    const configuration = await this.createConfiguration(
      createDto,
      queryRunner,
    );

    // Create compliance info
    const compliance = await this.createComplianceInfo(createDto, queryRunner);

    // Create security settings
    const security = await this.createSecuritySettings(queryRunner);

    // Create usage tracking
    const usage = await this.createUsageTracking(queryRunner);

    // Create integrations
    const integrations = await this.createIntegrations(queryRunner);

    // Create main tenant
    const tenant = queryRunner.manager.create(Tenant, {
      name: createDto.name,
      slug: createDto.slug,
      displayName: createDto.displayName,
      description: createDto.description,
      status: TenantStatus.INACTIVE, // Start as inactive until setup is complete
      lifecycleStage: TenantLifecycleStage.ONBOARDING,
      tags: createDto.tags || [],
      metadata: createDto.metadata || {},
      contactInfo,
      location,
      schoolInfo,
      subscription,
      configuration,
      compliance,
      security,
      usage,
      integrations,
    });

    return queryRunner.manager.save(Tenant, tenant);
  }

  private async updateTenantWithRelations(
    tenant: Tenant,
    updateDto: UpdateTenantDto,
    queryRunner: QueryRunner,
  ): Promise<void> {
    // Update basic tenant fields
    if (updateDto.name !== undefined) tenant.name = updateDto.name;
    if (updateDto.slug !== undefined) tenant.slug = updateDto.slug;
    if (updateDto.displayName !== undefined)
      tenant.displayName = updateDto.displayName;
    if (updateDto.description !== undefined)
      tenant.description = updateDto.description;
    if (updateDto.status !== undefined) tenant.status = updateDto.status;
    if (updateDto.lifecycleStage !== undefined)
      tenant.lifecycleStage = updateDto.lifecycleStage;
    if (updateDto.tags !== undefined) tenant.tags = updateDto.tags;
    if (updateDto.metadata !== undefined) tenant.metadata = updateDto.metadata;

    // Update nested entities if provided
    if (updateDto.contactInfo) {
      await this.updateContactInfo(
        tenant.contactInfo,
        updateDto.contactInfo,
        queryRunner,
      );
    }

    if (updateDto.location) {
      await this.updateLocation(
        tenant.location,
        updateDto.location,
        queryRunner,
      );
    }

    if (updateDto.schoolInfo) {
      await this.updateSchoolInfo(
        tenant.schoolInfo,
        updateDto.schoolInfo,
        queryRunner,
      );
    }

    if (updateDto.subscriptionPlan || updateDto.billingCycle) {
      await this.updateSubscriptionPlan(
        tenant.subscription,
        updateDto,
        queryRunner,
      );
    }

    if (updateDto.features) {
      Object.assign(tenant.configuration.features, updateDto.features);
      await queryRunner.manager.save(
        TenantFeatures,
        tenant.configuration.features,
      );
    }

    if (updateDto.limits) {
      Object.assign(tenant.configuration.limits, updateDto.limits);
      await queryRunner.manager.save(TenantLimits, tenant.configuration.limits);
    }

    if (updateDto.complianceRequirements) {
      await this.updateComplianceRequirements(
        tenant.compliance,
        updateDto.complianceRequirements,
        queryRunner,
      );
    }

    await queryRunner.manager.save(Tenant, tenant);
  }

  private async createAddress(
    addressDto: AddressDto,
    queryRunner: QueryRunner,
  ): Promise<Address> {
    const address = queryRunner.manager.create(Address, {
      street1: addressDto.street1,
      street2: addressDto.street2,
      city: addressDto.city,
      state: addressDto.state,
      postalCode: addressDto.postalCode,
      country: addressDto.country,
      latitude: addressDto.coordinates?.latitude,
      longitude: addressDto.coordinates?.longitude,
    });
    return queryRunner.manager.save(Address, address);
  }

  private async createContactPerson(
    contactDto: ContactPersonDto,
    queryRunner: QueryRunner,
  ): Promise<ContactPerson> {
    const contact = queryRunner.manager.create(ContactPerson, {
      name: contactDto.name,
      title: contactDto.title,
      email: contactDto.email,
      phone: contactDto.phone,
      department: contactDto.department,
    });
    return queryRunner.manager.save(ContactPerson, contact);
  }

  private async createAccreditationInfo(
    accreditationDto: AccreditationInfoDto,
    queryRunner: QueryRunner,
  ): Promise<AccreditationInfo> {
    const accreditation = queryRunner.manager.create(AccreditationInfo, {
      body: accreditationDto.body,
      status: accreditationDto.status,
      expiryDate: accreditationDto.expiryDate,
      certificateNumber: accreditationDto.certificateNumber,
    });
    return queryRunner.manager.save(AccreditationInfo, accreditation);
  }

  private async createSubscription(
    createDto: CreateTenantDto,
    queryRunner: QueryRunner,
  ): Promise<TenantSubscription> {
    // Create feature limits
    const featureLimits = await this.createFeatureLimits(
      createDto.subscriptionPlan,
      queryRunner,
    );

    // Create subscription limits
    const limits = queryRunner.manager.create(SubscriptionLimits, {
      ...this.getDefaultLimitsForPlan(createDto.subscriptionPlan),
      features: featureLimits,
    });
    await queryRunner.manager.save(SubscriptionLimits, limits);

    // Create billing info
    const billingInfo = queryRunner.manager.create(BillingInfo, {
      method: PaymentMethod.CREDIT_CARD,
      status: BillingStatus.CURRENT,
      nextBillingDate: this.calculateNextBillingDate(createDto.billingCycle),
      outstandingBalance: 0,
      invoices: [],
    });
    await queryRunner.manager.save(BillingInfo, billingInfo);

    // Create trial info if needed
    const trialInfo = queryRunner.manager.create(TrialInfo, {
      isTrialActive: true,
      trialStartDate: new Date(),
      trialEndDate: new Date(
        Date.now() +
          this.getTrialDays(createDto.subscriptionPlan) * 24 * 60 * 60 * 1000,
      ),
      trialDaysRemaining: this.getTrialDays(createDto.subscriptionPlan),
      trialPlan: createDto.subscriptionPlan,
      convertedFromTrial: false,
      extensionsUsed: 0,
      maxExtensions: 2,
    });
    await queryRunner.manager.save(TrialInfo, trialInfo);

    // Create subscription
    const subscription = queryRunner.manager.create(TenantSubscription, {
      plan: createDto.subscriptionPlan,
      status: SubscriptionStatus.TRIAL,
      billingCycle: createDto.billingCycle,
      startDate: new Date(),
      renewalDate: this.calculateRenewalDate(
        createDto.billingCycle,
        new Date(),
      ),
      basePrice: this.getBasePriceForPlan(createDto.subscriptionPlan),
      additionalUserPrice: this.getAdditionalUserPrice(
        createDto.subscriptionPlan,
      ),
      totalPrice: this.getBasePriceForPlan(createDto.subscriptionPlan),
      currency: 'USD',
      usageTracking: true,
      overageCharges: false,
      limits,
      billing: billingInfo,
      trial: trialInfo,
    });

    return queryRunner.manager.save(TenantSubscription, subscription);
  }

  private async createConfiguration(
    createDto: CreateTenantDto,
    queryRunner: QueryRunner,
  ): Promise<TenantConfiguration> {
    // Create password policy
    const passwordPolicy = queryRunner.manager.create(PasswordPolicy, {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      prohibitCommonPasswords: true,
      passwordExpiry: 90,
    });
    await queryRunner.manager.save(PasswordPolicy, passwordPolicy);

    // Create system settings
    const systemSettings = queryRunner.manager.create(SystemSettings, {
      maintenanceMode: false,
      debugMode: false,
      allowRegistration: true,
      requireEmailVerification: true,
      sessionTimeout: 480,
      passwordPolicy,
      backupFrequency: BackupFrequency.WEEKLY,
      dataRetentionPeriod: 2555, // 7 years
    });
    await queryRunner.manager.save(SystemSettings, systemSettings);

    // Create tenant features
    const features = queryRunner.manager.create(TenantFeatures, {
      ...this.getDefaultFeaturesForPlan(createDto.subscriptionPlan),
      ...createDto.features,
    });
    await queryRunner.manager.save(TenantFeatures, features);

    // Create tenant limits
    const limits = queryRunner.manager.create(TenantLimits, {
      ...this.getDefaultTenantLimitsForPlan(createDto.subscriptionPlan),
      ...createDto.limits,
    });
    await queryRunner.manager.save(TenantLimits, limits);

    // Create customizations
    const customizations = queryRunner.manager.create(TenantCustomizations, {
      allowCustomFields: features.customFields,
      customFieldsLimit: limits.maxUsers * 5,
      allowWorkflowCustomization: false,
      allowReportCustomization: features.reportsAnalytics,
      allowUICustomization: features.customBranding,
      customModules: [],
    });
    await queryRunner.manager.save(TenantCustomizations, customizations);

    // Create API settings
    const apiSettings = queryRunner.manager.create(ApiSettings, {
      enabled: features.apiAccess,
      version: '1.0',
      rateLimit: 1000,
      allowedOrigins: [],
      webhookEndpoints: [],
      apiKeys: [],
    });
    await queryRunner.manager.save(ApiSettings, apiSettings);

    // Create configuration
    const configuration = queryRunner.manager.create(TenantConfiguration, {
      systemSettings,
      features,
      limits,
      customizations,
      apiSettings,
    });

    return queryRunner.manager.save(TenantConfiguration, configuration);
  }

  private async createComplianceInfo(
    createDto: CreateTenantDto,
    queryRunner: QueryRunner,
  ): Promise<ComplianceInfo> {
    const requirements = createDto.complianceRequirements || [];

    const compliance = queryRunner.manager.create(ComplianceInfo, {
      gdprCompliant: requirements.includes('gdpr'),
      coppaCompliant: requirements.includes('coppa'),
      ferpaCompliant: requirements.includes('ferpa'),
      hipaaCompliant: requirements.includes('hipaa'),
      localRegulations: requirements.filter(
        (req) => !['gdpr', 'coppa', 'ferpa', 'hipaa'].includes(req),
      ),
      certifications: [],
      dataProcessingAddendum: true,
      dataRetentionPolicy: '7 years as per educational requirements',
      rightToErasure: true,
      dataPortability: true,
    });

    return queryRunner.manager.save(ComplianceInfo, compliance);
  }

  private async createSecuritySettings(
    queryRunner: QueryRunner,
  ): Promise<SecuritySettings> {
    const security = queryRunner.manager.create(SecuritySettings, {
      mfaRequired: false,
      ssoEnabled: false,
      sessionTimeout: 480,
      rbacEnabled: true,
      customRoles: false,
      ipWhitelisting: false,
      allowedIPs: [],
      encryptionAtRest: true,
      encryptionInTransit: true,
      auditLogging: true,
      realTimeMonitoring: false,
      securityIncidents: [],
      backupEncryption: true,
      disasterRecovery: false,
      rpo: 24,
      rto: 4,
    });

    return queryRunner.manager.save(SecuritySettings, security);
  }

  private async createUsageTracking(
    queryRunner: QueryRunner,
  ): Promise<TenantUsage> {
    const usage = queryRunner.manager.create(TenantUsage, {
      totalUsers: 0,
      activeUsers: 0,
      lastMonthActiveUsers: 0,
      totalStudents: 0,
      activeStudents: 0,
      storageUsed: 0,
      apiCallsThisMonth: 0,
      bandwidthUsed: 0,
      featureUsage: {},
      averageResponseTime: 0,
      uptime: 100,
      errorRate: 0,
      monthlyGrowthRate: 0,
      retentionRate: 100,
      churnRisk: 0,
    });

    return queryRunner.manager.save(TenantUsage, usage);
  }

  private async createIntegrations(
    queryRunner: QueryRunner,
  ): Promise<TenantIntegrations> {
    const integrations = queryRunner.manager.create(TenantIntegrations, {
      lmsIntegrations: [],
      paymentGateways: [],
      communicationTools: [],
      analyticsIntegrations: [],
      ssoProviders: [],
      customIntegrations: [],
    });

    return queryRunner.manager.save(TenantIntegrations, integrations);
  }

  private async createFeatureLimits(
    plan: SubscriptionPlan,
    queryRunner: QueryRunner,
  ): Promise<FeatureLimits> {
    const limits = queryRunner.manager.create(FeatureLimits, {
      ...this.getDefaultFeatureLimitsForPlan(plan),
    });

    return queryRunner.manager.save(FeatureLimits, limits);
  }

  // Update helper methods
  private async updateContactInfo(
    contactInfo: TenantContactInfo,
    updateDto: UpdateTenantContactInfoDto,
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (updateDto.phone !== undefined) contactInfo.phone = updateDto.phone;
    if (updateDto.email !== undefined) contactInfo.email = updateDto.email;
    if (updateDto.website !== undefined)
      contactInfo.website = updateDto.website;

    if (updateDto.primaryContact) {
      Object.assign(contactInfo.primaryContact, updateDto.primaryContact);
      await queryRunner.manager.save(ContactPerson, contactInfo.primaryContact);
    }

    if (updateDto.address) {
      Object.assign(contactInfo.address, updateDto.address);
      await queryRunner.manager.save(Address, contactInfo.address);
    }

    await queryRunner.manager.save(TenantContactInfo, contactInfo);
  }

  private async updateLocation(
    location: TenantLocation,
    updateDto: UpdateTenantLocationDto,
    queryRunner: QueryRunner,
  ): Promise<void> {
    Object.assign(location, updateDto);

    if (updateDto.address) {
      Object.assign(location.address, updateDto.address);
      await queryRunner.manager.save(Address, location.address);
    }

    await queryRunner.manager.save(TenantLocation, location);
  }

  private async updateSchoolInfo(
    schoolInfo: SchoolInfo,
    updateDto: any,
    queryRunner: QueryRunner,
  ): Promise<void> {
    Object.assign(schoolInfo, updateDto);
    await queryRunner.manager.save(SchoolInfo, schoolInfo);
  }

  private async updateSubscriptionPlan(
    subscription: TenantSubscription,
    updateDto: UpdateTenantDto,
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (updateDto.subscriptionPlan) {
      subscription.plan = updateDto.subscriptionPlan;
      await this.updateLimitsForPlan(
        subscription.limits,
        updateDto.subscriptionPlan,
        queryRunner,
      );
    }

    if (updateDto.billingCycle) {
      subscription.billingCycle = updateDto.billingCycle;
      subscription.renewalDate = this.calculateRenewalDate(
        updateDto.billingCycle,
        subscription.startDate,
      );
    }

    await queryRunner.manager.save(TenantSubscription, subscription);
  }

  private async updateComplianceRequirements(
    compliance: ComplianceInfo,
    requirements: string[],
    queryRunner: QueryRunner,
  ): Promise<void> {
    compliance.gdprCompliant = requirements.includes('gdpr');
    compliance.coppaCompliant = requirements.includes('coppa');
    compliance.ferpaCompliant = requirements.includes('ferpa');
    compliance.hipaaCompliant = requirements.includes('hipaa');
    compliance.localRegulations = requirements.filter(
      (req) => !['gdpr', 'coppa', 'ferpa', 'hipaa'].includes(req),
    );

    await queryRunner.manager.save(ComplianceInfo, compliance);
  }

  private async updateLimitsForPlan(
    limits: SubscriptionLimits,
    plan: SubscriptionPlan,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const defaultLimits = this.getDefaultLimitsForPlan(plan);
    Object.assign(limits, defaultLimits);

    const featureLimits = this.getDefaultFeatureLimitsForPlan(plan);
    Object.assign(limits.features, featureLimits);

    await queryRunner.manager.save(FeatureLimits, limits.features);
    await queryRunner.manager.save(SubscriptionLimits, limits);
  }

  // Query helper methods
  private addRelations(queryBuilder: SelectQueryBuilder<Tenant>): void {
    queryBuilder
      .leftJoinAndSelect('tenant.contactInfo', 'contactInfo')
      .leftJoinAndSelect('contactInfo.primaryContact', 'primaryContact')
      .leftJoinAndSelect('contactInfo.billingContact', 'billingContact')
      .leftJoinAndSelect('contactInfo.technicalContact', 'technicalContact')
      .leftJoinAndSelect('contactInfo.emergencyContact', 'emergencyContact')
      .leftJoinAndSelect('contactInfo.address', 'contactAddress')
      .leftJoinAndSelect('tenant.location', 'location')
      .leftJoinAndSelect('location.address', 'locationAddress')
      .leftJoinAndSelect('tenant.schoolInfo', 'schoolInfo')
      .leftJoinAndSelect('schoolInfo.accreditation', 'accreditation')
      .leftJoinAndSelect('tenant.subscription', 'subscription')
      .leftJoinAndSelect('subscription.limits', 'subscriptionLimits')
      .leftJoinAndSelect('subscriptionLimits.features', 'featureLimits')
      .leftJoinAndSelect('subscription.billing', 'billing')
      .leftJoinAndSelect('billing.billingAddress', 'billingAddress')
      .leftJoinAndSelect('subscription.trial', 'trial')
      .leftJoinAndSelect('tenant.configuration', 'configuration')
      .leftJoinAndSelect('configuration.systemSettings', 'systemSettings')
      .leftJoinAndSelect('systemSettings.passwordPolicy', 'passwordPolicy')
      .leftJoinAndSelect('configuration.features', 'tenantFeatures')
      .leftJoinAndSelect('configuration.limits', 'tenantLimits')
      .leftJoinAndSelect('configuration.customizations', 'customizations')
      .leftJoinAndSelect('configuration.apiSettings', 'apiSettings')
      .leftJoinAndSelect('tenant.compliance', 'compliance')
      .leftJoinAndSelect('compliance.certifications', 'certifications')
      .leftJoinAndSelect('tenant.security', 'security')
      .leftJoinAndSelect('security.securityIncidents', 'securityIncidents')
      .leftJoinAndSelect('tenant.usage', 'usage')
      .leftJoinAndSelect('tenant.branding', 'branding')
      .leftJoinAndSelect('tenant.integrations', 'integrations')
      .leftJoinAndSelect('integrations.lmsIntegrations', 'lmsIntegrations')
      .leftJoinAndSelect('integrations.paymentGateways', 'paymentGateways')
      .leftJoinAndSelect(
        'integrations.communicationTools',
        'communicationTools',
      )
      .leftJoinAndSelect(
        'integrations.analyticsIntegrations',
        'analyticsIntegrations',
      )
      .leftJoinAndSelect('integrations.ssoProviders', 'ssoProviders')
      .leftJoinAndSelect(
        'integrations.customIntegrations',
        'customIntegrations',
      );
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Tenant>,
    query: TenantQueryDto,
  ): void {
    // Status filter
    if (query.status) {
      queryBuilder.andWhere('tenant.status = :status', {
        status: query.status,
      });
    }

    // Lifecycle stage filter
    if (query.lifecycleStage) {
      queryBuilder.andWhere('tenant.lifecycleStage = :lifecycleStage', {
        lifecycleStage: query.lifecycleStage,
      });
    }

    // Subscription plan filter
    if (query.subscriptionPlan) {
      queryBuilder.andWhere('subscription.plan = :subscriptionPlan', {
        subscriptionPlan: query.subscriptionPlan,
      });
    }

    // Subscription status filter
    if (query.subscriptionStatus) {
      queryBuilder.andWhere('subscription.status = :subscriptionStatus', {
        subscriptionStatus: query.subscriptionStatus,
      });
    }

    // School type filter
    if (query.schoolType) {
      queryBuilder.andWhere('schoolInfo.type = :schoolType', {
        schoolType: query.schoolType,
      });
    }

    // Region filter
    if (query.region) {
      queryBuilder.andWhere('location.region = :region', {
        region: query.region,
      });
    }

    // Country filter
    if (query.country) {
      queryBuilder.andWhere('location.country = :country', {
        country: query.country,
      });
    }

    // Trial ending soon filter
    if (query.trialEndingSoon) {
      const futureDate = new Date(
        Date.now() + query.trialEndingSoon * 24 * 60 * 60 * 1000,
      );
      queryBuilder.andWhere('trial.trialEndDate BETWEEN :now AND :futureDate', {
        now: new Date(),
        futureDate,
      });
    }

    // Date range filters
    if (query.createdAfter) {
      queryBuilder.andWhere('tenant.createdAt >= :createdAfter', {
        createdAfter: new Date(query.createdAfter),
      });
    }

    if (query.createdBefore) {
      queryBuilder.andWhere('tenant.createdAt <= :createdBefore', {
        createdBefore: new Date(query.createdBefore),
      });
    }

    // Soft delete filter
    if (!query.includeDeleted) {
      queryBuilder.andWhere('tenant.deletedAt IS NULL');
    }
  }

  // Utility methods
  private getTrialDays(plan: SubscriptionPlan): number {
    switch (plan) {
      case SubscriptionPlan.STARTER:
        return 14;
      case SubscriptionPlan.PROFESSIONAL:
        return 30;
      case SubscriptionPlan.ENTERPRISE:
        return 45;
      case SubscriptionPlan.CUSTOM:
        return 30;
      default:
        return 14;
    }
  }

  private getBasePriceForPlan(plan: SubscriptionPlan): number {
    switch (plan) {
      case SubscriptionPlan.STARTER:
        return 29.99;
      case SubscriptionPlan.PROFESSIONAL:
        return 99.99;
      case SubscriptionPlan.ENTERPRISE:
        return 299.99;
      case SubscriptionPlan.CUSTOM:
        return 0; // Custom pricing
      default:
        return 29.99;
    }
  }

  private getAdditionalUserPrice(plan: SubscriptionPlan): number {
    switch (plan) {
      case SubscriptionPlan.STARTER:
        return 2.99;
      case SubscriptionPlan.PROFESSIONAL:
        return 4.99;
      case SubscriptionPlan.ENTERPRISE:
        return 7.99;
      case SubscriptionPlan.CUSTOM:
        return 0;
      default:
        return 2.99;
    }
  }

  private getDefaultLimitsForPlan(plan: SubscriptionPlan) {
    switch (plan) {
      case SubscriptionPlan.STARTER:
        return {
          maxUsers: 10,
          maxStudents: 100,
          maxStorage: 5,
          maxApiCalls: 1000,
          maxSchoolYears: 2,
          maxClasses: 10,
        };
      case SubscriptionPlan.PROFESSIONAL:
        return {
          maxUsers: 50,
          maxStudents: 500,
          maxStorage: 25,
          maxApiCalls: 10000,
          maxSchoolYears: 5,
          maxClasses: 50,
        };
      case SubscriptionPlan.ENTERPRISE:
        return {
          maxUsers: 200,
          maxStudents: 2000,
          maxStorage: 100,
          maxApiCalls: 100000,
          maxSchoolYears: 10,
          maxClasses: 200,
        };
      case SubscriptionPlan.CUSTOM:
        return {
          maxUsers: -1, // Unlimited
          maxStudents: -1,
          maxStorage: -1,
          maxApiCalls: -1,
          maxSchoolYears: -1,
          maxClasses: -1,
        };
      default:
        return {
          maxUsers: 10,
          maxStudents: 100,
          maxStorage: 5,
          maxApiCalls: 1000,
          maxSchoolYears: 2,
          maxClasses: 10,
        };
    }
  }

  private getDefaultFeatureLimitsForPlan(plan: SubscriptionPlan) {
    switch (plan) {
      case SubscriptionPlan.STARTER:
        return {
          customBranding: false,
          apiAccess: false,
          ssoIntegration: false,
          advancedReports: false,
          mobileApp: false,
          parentPortal: true,
          studentPortal: true,
          bulkOperations: false,
          dataExport: false,
          automatedBackups: false,
          prioritySupport: false,
          dedicatedAccountManager: false,
        };
      case SubscriptionPlan.PROFESSIONAL:
        return {
          customBranding: true,
          apiAccess: true,
          ssoIntegration: false,
          advancedReports: true,
          mobileApp: true,
          parentPortal: true,
          studentPortal: true,
          bulkOperations: true,
          dataExport: true,
          automatedBackups: true,
          prioritySupport: true,
          dedicatedAccountManager: false,
        };
      case SubscriptionPlan.ENTERPRISE:
        return {
          customBranding: true,
          apiAccess: true,
          ssoIntegration: true,
          advancedReports: true,
          mobileApp: true,
          parentPortal: true,
          studentPortal: true,
          bulkOperations: true,
          dataExport: true,
          automatedBackups: true,
          prioritySupport: true,
          dedicatedAccountManager: true,
        };
      case SubscriptionPlan.CUSTOM:
        return {
          customBranding: true,
          apiAccess: true,
          ssoIntegration: true,
          advancedReports: true,
          mobileApp: true,
          parentPortal: true,
          studentPortal: true,
          bulkOperations: true,
          dataExport: true,
          automatedBackups: true,
          prioritySupport: true,
          dedicatedAccountManager: true,
        };
      default:
        return {
          customBranding: false,
          apiAccess: false,
          ssoIntegration: false,
          advancedReports: false,
          mobileApp: false,
          parentPortal: true,
          studentPortal: true,
          bulkOperations: false,
          dataExport: false,
          automatedBackups: false,
          prioritySupport: false,
          dedicatedAccountManager: false,
        };
    }
  }

  private getDefaultFeaturesForPlan(plan: SubscriptionPlan) {
    switch (plan) {
      case SubscriptionPlan.STARTER:
        return {
          academicManagement: true,
          feeManagement: true,
          libraryManagement: false,
          transportManagement: false,
          inventoryManagement: false,
          hrManagement: false,
          parentPortal: true,
          studentPortal: true,
          mobileApp: false,
          reportsAnalytics: false,
          timetableManagement: true,
          communicationTools: true,
          examManagement: true,
          disciplineTracking: false,
          healthRecords: false,
          customFields: false,
          apiAccess: false,
          ssoIntegration: false,
          customBranding: false,
          advancedSecurity: false,
        };
      case SubscriptionPlan.PROFESSIONAL:
        return {
          academicManagement: true,
          feeManagement: true,
          libraryManagement: true,
          transportManagement: true,
          inventoryManagement: true,
          hrManagement: false,
          parentPortal: true,
          studentPortal: true,
          mobileApp: true,
          reportsAnalytics: true,
          timetableManagement: true,
          communicationTools: true,
          examManagement: true,
          disciplineTracking: true,
          healthRecords: true,
          customFields: true,
          apiAccess: true,
          ssoIntegration: false,
          customBranding: true,
          advancedSecurity: false,
        };
      case SubscriptionPlan.ENTERPRISE:
        return {
          academicManagement: true,
          feeManagement: true,
          libraryManagement: true,
          transportManagement: true,
          inventoryManagement: true,
          hrManagement: true,
          parentPortal: true,
          studentPortal: true,
          mobileApp: true,
          reportsAnalytics: true,
          timetableManagement: true,
          communicationTools: true,
          examManagement: true,
          disciplineTracking: true,
          healthRecords: true,
          customFields: true,
          apiAccess: true,
          ssoIntegration: true,
          customBranding: true,
          advancedSecurity: true,
        };
      case SubscriptionPlan.CUSTOM:
        return {
          academicManagement: true,
          feeManagement: true,
          libraryManagement: true,
          transportManagement: true,
          inventoryManagement: true,
          hrManagement: true,
          parentPortal: true,
          studentPortal: true,
          mobileApp: true,
          reportsAnalytics: true,
          timetableManagement: true,
          communicationTools: true,
          examManagement: true,
          disciplineTracking: true,
          healthRecords: true,
          customFields: true,
          apiAccess: true,
          ssoIntegration: true,
          customBranding: true,
          advancedSecurity: true,
        };
      default:
        return {
          academicManagement: true,
          feeManagement: true,
          libraryManagement: false,
          transportManagement: false,
          inventoryManagement: false,
          hrManagement: false,
          parentPortal: true,
          studentPortal: true,
          mobileApp: false,
          reportsAnalytics: false,
          timetableManagement: true,
          communicationTools: true,
          examManagement: true,
          disciplineTracking: false,
          healthRecords: false,
          customFields: false,
          apiAccess: false,
          ssoIntegration: false,
          customBranding: false,
          advancedSecurity: false,
        };
    }
  }

  private getDefaultTenantLimitsForPlan(plan: SubscriptionPlan) {
    switch (plan) {
      case SubscriptionPlan.STARTER:
        return {
          maxUsers: 10,
          maxStudents: 100,
          maxStaff: 20,
          maxClasses: 10,
          maxSubjects: 20,
          storageQuota: 5,
          monthlyApiCalls: 1000,
          dailyEmailLimit: 100,
          concurrentSessions: 50,
        };
      case SubscriptionPlan.PROFESSIONAL:
        return {
          maxUsers: 50,
          maxStudents: 500,
          maxStaff: 100,
          maxClasses: 50,
          maxSubjects: 100,
          storageQuota: 25,
          monthlyApiCalls: 10000,
          dailyEmailLimit: 1000,
          concurrentSessions: 250,
        };
      case SubscriptionPlan.ENTERPRISE:
        return {
          maxUsers: 200,
          maxStudents: 2000,
          maxStaff: 400,
          maxClasses: 200,
          maxSubjects: 400,
          storageQuota: 100,
          monthlyApiCalls: 100000,
          dailyEmailLimit: 10000,
          concurrentSessions: 1000,
        };
      case SubscriptionPlan.CUSTOM:
        return {
          maxUsers: -1,
          maxStudents: -1,
          maxStaff: -1,
          maxClasses: -1,
          maxSubjects: -1,
          storageQuota: -1,
          monthlyApiCalls: -1,
          dailyEmailLimit: -1,
          concurrentSessions: -1,
        };
      default:
        return {
          maxUsers: 10,
          maxStudents: 100,
          maxStaff: 20,
          maxClasses: 10,
          maxSubjects: 20,
          storageQuota: 5,
          monthlyApiCalls: 1000,
          dailyEmailLimit: 100,
          concurrentSessions: 50,
        };
    }
  }

  private calculateRenewalDate(
    billingCycle: BillingCycle,
    startDate: Date,
  ): Date {
    const renewal = new Date(startDate);

    switch (billingCycle) {
      case BillingCycle.MONTHLY:
        renewal.setMonth(renewal.getMonth() + 1);
        break;
      case BillingCycle.QUARTERLY:
        renewal.setMonth(renewal.getMonth() + 3);
        break;
      case BillingCycle.ANNUAL:
        renewal.setFullYear(renewal.getFullYear() + 1);
        break;
      case BillingCycle.BIENNIAL:
        renewal.setFullYear(renewal.getFullYear() + 2);
        break;
    }

    return renewal;
  }

  private calculateNextBillingDate(billingCycle: BillingCycle): Date {
    return this.calculateRenewalDate(billingCycle, new Date());
  }

  private getTenantStatusFromSubscription(
    subscriptionStatus: SubscriptionStatus,
  ): TenantStatus {
    switch (subscriptionStatus) {
      case SubscriptionStatus.ACTIVE:
        return TenantStatus.ACTIVE;
      case SubscriptionStatus.TRIAL:
        return TenantStatus.ACTIVE;
      case SubscriptionStatus.SUSPENDED:
        return TenantStatus.SUSPENDED;
      case SubscriptionStatus.CANCELLED:
        return TenantStatus.INACTIVE;
      case SubscriptionStatus.EXPIRED:
        return TenantStatus.SUSPENDED;
      case SubscriptionStatus.PENDING:
        return TenantStatus.INACTIVE;
      default:
        return TenantStatus.INACTIVE;
    }
  }

  private getLifecycleStageFromSubscription(
    subscriptionStatus: SubscriptionStatus,
  ): TenantLifecycleStage {
    switch (subscriptionStatus) {
      case SubscriptionStatus.ACTIVE:
        return TenantLifecycleStage.ACTIVE;
      case SubscriptionStatus.TRIAL:
        return TenantLifecycleStage.TRIAL;
      case SubscriptionStatus.SUSPENDED:
        return TenantLifecycleStage.AT_RISK;
      case SubscriptionStatus.CANCELLED:
        return TenantLifecycleStage.CHURNED;
      case SubscriptionStatus.EXPIRED:
        return TenantLifecycleStage.CHURNED;
      case SubscriptionStatus.PENDING:
        return TenantLifecycleStage.PROSPECT;
      default:
        return TenantLifecycleStage.PROSPECT;
    }
  }

  async createMinimal(
    createDto: CreateTenantMinimalDto,
    userId?: string,
  ): Promise<{ tenant: Tenant; user?: User }> {
    if (!userId) {
      throw new NotFoundException('UserId not provided');
    }

    // Check for unique email
    const existingByEmail = await this.contactInfoRepository.findOne({
      where: { email: createDto.email },
    });

    if (existingByEmail) {
      throw new ConflictException('Tenant with this email already exists');
    }

    // Generate slug from name
    const slug = createDto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingBySlug = await this.tenantRepository.findOne({
      where: { slug },
    });

    if (existingBySlug) {
      throw new ConflictException('Tenant with this name already exists');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create minimal tenant using helper method
      const tenant = await this.createMinimalTenant(
        createDto,
        slug,
        queryRunner,
      );

      // Assign user to tenant as ADMIN if userId provided
      let updatedUser: User | undefined;
      if (userId) {
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });

        if (user) {
          // Check if user already has a tenant
          if (user.tenantId) {
            await queryRunner.rollbackTransaction();
            throw new ConflictException('User already belongs to a tenant');
          }

          // Check if email is verified
          if (!user.emailVerified) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(
              'Email must be verified to create a tenant',
            );
          }

          // Update user's tenant and role
          user.tenantId = tenant.id;
          user.role = UserRole.ADMIN;
          updatedUser = await queryRunner.manager.save(User, user);

          console.log(
            `User ${user.email} assigned as ADMIN of tenant ${tenant.name}`,
          );
        }
      }

      await queryRunner.commitTransaction();

      // Return tenant with all relations loaded
      const fullTenant = await this.findOne(tenant.id);
      return {
        tenant: fullTenant,
        user: updatedUser,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to create tenant: ${error}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Helper method to create a minimal tenant with default values
   * This is separated from createTenantWithRelations to avoid requiring full DTO
   */
  private async createMinimalTenant(
    createDto: CreateTenantMinimalDto,
    slug: string,
    queryRunner: QueryRunner,
  ): Promise<Tenant> {
    // 1. Create Address
    const address = queryRunner.manager.create(Address, {
      street1: createDto.street || 'Not provided',
      street2: undefined,
      city: createDto.city || 'Not provided',
      state: createDto.state || 'Not provided',
      postalCode: createDto.postalCode || '00000',
      country: createDto.country || 'Not provided',
      latitude: undefined,
      longitude: undefined,
    });
    await queryRunner.manager.save(Address, address);

    // 2. Create Contact Person
    const primaryContact = queryRunner.manager.create(ContactPerson, {
      name: 'Administrator',
      title: 'Administrator',
      email: createDto.email,
      phone: createDto.phone,
      department: undefined,
    });
    await queryRunner.manager.save(ContactPerson, primaryContact);

    // 3. Create Contact Info
    const contactInfo = queryRunner.manager.create(TenantContactInfo, {
      primaryContact,
      billingContact: undefined,
      technicalContact: undefined,
      emergencyContact: undefined,
      phone: createDto.phone,
      email: createDto.email,
      website: undefined,
      address,
    });
    await queryRunner.manager.save(TenantContactInfo, contactInfo);

    // 4. Create Location
    const location = queryRunner.manager.create(TenantLocation, {
      timezone: 'UTC',
      locale: 'en_US',
      currency: 'USD',
      region: createDto.state || 'Not specified',
      country: createDto.country || 'Not specified',
      address,
    });
    await queryRunner.manager.save(TenantLocation, location);

    // 5. Create School Info
    const schoolInfo = queryRunner.manager.create(SchoolInfo, {
      type: SchoolType.PUBLIC,
      category: SchoolCategory.ELEMENTARY,
      levels: ['elementary' as any],
      foundedYear: undefined,
      principalName: undefined,
      studentCapacity: 100,
      currentEnrollment: 0,
      staffCount: 0,
      accreditation: [],
      academicCalendar: AcademicCalendarType.SEMESTER,
      languagesOffered: ['English'],
      specialPrograms: [],
    });
    await queryRunner.manager.save(SchoolInfo, schoolInfo);

    // 6. Create Feature Limits (for subscription)
    const featureLimits = queryRunner.manager.create(FeatureLimits, {
      customBranding: false,
      apiAccess: false,
      ssoIntegration: false,
      advancedReports: false,
      mobileApp: false,
      parentPortal: true,
      studentPortal: true,
      bulkOperations: false,
      dataExport: false,
      automatedBackups: false,
      prioritySupport: false,
      dedicatedAccountManager: false,
    });
    await queryRunner.manager.save(FeatureLimits, featureLimits);

    // 7. Create Subscription Limits
    const subscriptionLimits = queryRunner.manager.create(SubscriptionLimits, {
      maxUsers: 10,
      maxStudents: 100,
      maxStorage: 5,
      maxApiCalls: 1000,
      maxSchoolYears: 2,
      maxClasses: 10,
      features: featureLimits,
    });
    await queryRunner.manager.save(SubscriptionLimits, subscriptionLimits);

    // 8. Create Billing Info
    const billingInfo = queryRunner.manager.create(BillingInfo, {
      method: PaymentMethod.CREDIT_CARD,
      status: BillingStatus.PENDING,
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      lastPaymentDate: undefined,
      lastPaymentAmount: undefined,
      outstandingBalance: 0,
      billingHistory: [],
    });
    await queryRunner.manager.save(BillingInfo, billingInfo);

    // 9. Create Trial Info
    const trialInfo = queryRunner.manager.create(TrialInfo, {
      isTrialActive: true,
      trialStartDate: new Date(),
      trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      trialDaysRemaining: 30,
      trialPlan: SubscriptionPlan.STARTER,
      convertedFromTrial: false,
      conversionDate: undefined,
      extensionsUsed: 0,
      maxExtensions: 2,
    });
    await queryRunner.manager.save(TrialInfo, trialInfo);

    // 10. Create Subscription
    const subscription = queryRunner.manager.create(TenantSubscription, {
      plan: SubscriptionPlan.STARTER,
      status: SubscriptionStatus.TRIAL,
      billingCycle: BillingCycle.MONTHLY,
      startDate: new Date(),
      endDate: undefined,
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      basePrice: 29.99,
      additionalUserPrice: 2.99,
      totalPrice: 29.99,
      discountPercent: undefined,
      discountAmount: undefined,
      currency: 'USD',
      paymentStatus: 'pending',
      autoRenewal: true,
      gracePeriodDays: 7,
      usageTracking: true,
      overageCharges: false,
      limits: subscriptionLimits,
      billing: billingInfo,
      trial: trialInfo,
    });
    await queryRunner.manager.save(TenantSubscription, subscription);

    // 11. Create Password Policy
    const passwordPolicy = queryRunner.manager.create(PasswordPolicy, {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      prohibitCommonPasswords: true,
      passwordExpiry: 90,
      passwordHistory: 5,
    });
    await queryRunner.manager.save(PasswordPolicy, passwordPolicy);

    // 12. Create System Settings
    const systemSettings = queryRunner.manager.create(SystemSettings, {
      maintenanceMode: false,
      debugMode: false,
      allowRegistration: true,
      requireEmailVerification: true,
      sessionTimeout: 480,
      passwordPolicy,
      defaultLanguage: 'en',
      defaultTimezone: 'UTC',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: '24h',
      currency: 'USD',
      backupFrequency: BackupFrequency.NEVER,
      dataRetentionPeriod: 2555,
    });
    await queryRunner.manager.save(SystemSettings, systemSettings);

    // 13. Create Tenant Features
    const features = queryRunner.manager.create(TenantFeatures, {
      academicManagement: true,
      feeManagement: true,
      libraryManagement: false,
      transportManagement: false,
      inventoryManagement: false,
      hrManagement: false,
      parentPortal: true,
      studentPortal: true,
      mobileApp: false,
      reportsAnalytics: false,
      timetableManagement: true,
      communicationTools: true,
      examManagement: true,
      disciplineTracking: false,
      healthRecords: false,
      customFields: false,
      apiAccess: false,
      ssoIntegration: false,
      customBranding: false,
      advancedSecurity: false,
    });
    await queryRunner.manager.save(TenantFeatures, features);

    // 14. Create Tenant Limits
    const tenantLimits = queryRunner.manager.create(TenantLimits, {
      maxUsers: 10,
      maxStudents: 100,
      maxStaff: 20,
      maxClasses: 10,
      maxSubjects: 20,
      storageQuota: 5,
      monthlyApiCalls: 1000,
      dailyEmailLimit: 100,
      concurrentSessions: 50,
    });
    await queryRunner.manager.save(TenantLimits, tenantLimits);

    // 15. Create Customizations
    const customizations = queryRunner.manager.create(TenantCustomizations, {
      allowCustomFields: false,
      customFieldsLimit: 50,
      allowWorkflowCustomization: false,
      allowReportCustomization: false,
      allowUICustomization: false,
      customModules: [],
    });
    await queryRunner.manager.save(TenantCustomizations, customizations);

    // 16. Create API Settings
    const apiSettings = queryRunner.manager.create(ApiSettings, {
      enabled: false,
      version: '1.0',
      rateLimit: 1000,
      allowedOrigins: [],
      webhookEndpoints: [],
      apiKeys: [],
    });
    await queryRunner.manager.save(ApiSettings, apiSettings);

    // 17. Create Configuration
    const configuration = queryRunner.manager.create(TenantConfiguration, {
      systemSettings,
      features,
      limits: tenantLimits,
      customizations,
      apiSettings,
    });
    await queryRunner.manager.save(TenantConfiguration, configuration);

    // 18. Create Compliance Info
    const compliance = queryRunner.manager.create(ComplianceInfo, {
      gdprCompliant: true,
      ferpaCompliant: false,
      hipaaCompliant: false,
      coppaCompliant: false,
      dataProcessingAddendum: true,
      privacyShieldCertified: false,
      iso27001Certified: false,
      soc2Compliant: false,
      rightToErasure: true,
      dataPortability: true,
      consentManagement: true,
      certifications: [],
    });
    await queryRunner.manager.save(ComplianceInfo, compliance);

    // 19. Create Security Settings
    const security = queryRunner.manager.create(SecuritySettings, {
      twoFactorEnabled: false,
      twoFactorEnforced: false,
      ipWhitelisting: false,
      sessionManagement: true,
      auditLogging: true,
      encryptionAtRest: true,
      encryptionInTransit: true,
      allowedIps: [],
      blockedIps: [],
      securityNotifications: true,
      passwordResetRequired: false,
      lastSecurityAudit: new Date(),
      securityIncidents: [],
    });
    await queryRunner.manager.save(SecuritySettings, security);

    // 20. Create Usage Tracking
    const usage = queryRunner.manager.create(TenantUsage, {
      storageUsed: 0,
      apiCallsThisMonth: 0,
      activeUsers: 0,
      totalStudents: 0,
      totalStaff: 0,
      totalClasses: 0,
      lastActivityDate: new Date(),
      peakConcurrentUsers: 0,
    });
    await queryRunner.manager.save(TenantUsage, usage);

    // 21. Create Integrations
    const integrations = queryRunner.manager.create(TenantIntegrations, {
      lmsIntegrations: [],
      paymentGateways: [],
      communicationTools: [],
      analyticsIntegrations: [],
      ssoConfigurations: [],
      customIntegrations: [],
    });
    await queryRunner.manager.save(TenantIntegrations, integrations);

    // 22. Create Main Tenant
    const tenant = queryRunner.manager.create(Tenant, {
      name: createDto.name,
      slug,
      displayName: createDto.name,
      description: `Created on ${new Date().toLocaleDateString()}`,
      status: TenantStatus.ACTIVE,
      lifecycleStage: TenantLifecycleStage.ONBOARDING,
      tags: [],
      metadata: {
        createdMinimal: true,
        code: createDto.code,
        createdDate: new Date().toISOString(),
      },
      contactInfo,
      location,
      schoolInfo,
      subscription,
      configuration,
      compliance,
      security,
      usage,
      integrations,
      branding: undefined, // Will be created later if needed
    });

    return queryRunner.manager.save(Tenant, tenant);
  }
}
