import {
  WaitlistSubscriber,
  SubscriberStatus,
  SubscriberSource,
} from '../entities/waitlist-subscriber.entity';

export class SubscriberResponseDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  role?: string;
  phoneNumber?: string;
  country?: string;
  status: SubscriberStatus;
  source: SubscriberSource;
  locale?: string;
  referralCode?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  metadata?: Record<string, any>;
  notifiedAt?: Date;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: WaitlistSubscriber): SubscriberResponseDto {
    const dto = new SubscriberResponseDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.organization = entity.organization;
    dto.role = entity.role;
    dto.phoneNumber = entity.phoneNumber;
    dto.country = entity.country;
    dto.status = entity.status;
    dto.source = entity.source;
    dto.locale = entity.locale;
    dto.referralCode = entity.referralCode;
    dto.utmSource = entity.utmSource;
    dto.utmMedium = entity.utmMedium;
    dto.utmCampaign = entity.utmCampaign;
    dto.metadata = entity.metadata;
    dto.notifiedAt = entity.notifiedAt;
    dto.unsubscribedAt = entity.unsubscribedAt;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}

export class SubscriberStatsDto {
  total: number;
  active: number;
  notified: number;
  unsubscribed: number;
  bySource: Record<string, number>;
  byCountry: Record<string, number>;
  recentSignups: number;
}
