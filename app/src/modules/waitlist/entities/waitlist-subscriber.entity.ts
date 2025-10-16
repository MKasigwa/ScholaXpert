import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, Column, Index } from 'typeorm';

export enum SubscriberStatus {
  ACTIVE = 'active',
  NOTIFIED = 'notified',
  UNSUBSCRIBED = 'unsubscribed',
}

export enum SubscriberSource {
  COMING_SOON_PAGE = 'coming_soon_page',
  LANDING_PAGE = 'landing_page',
  REFERRAL = 'referral',
  OTHER = 'other',
}

@Entity('waitlist_subscribers')
@Index(['email'], { unique: true })
@Index(['status'])
@Index(['createdAt'])
export class WaitlistSubscriber extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  organization?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  role?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country?: string;

  @Column({
    type: 'enum',
    enum: SubscriberStatus,
    default: SubscriberStatus.ACTIVE,
  })
  status: SubscriberStatus;

  @Column({
    type: 'enum',
    enum: SubscriberSource,
    default: SubscriberSource.COMING_SOON_PAGE,
  })
  source: SubscriberSource;

  @Column({ type: 'varchar', length: 50, nullable: true })
  locale?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referralCode?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  utmSource?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  utmMedium?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  utmCampaign?: string;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  notifiedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  unsubscribedAt?: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress?: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;
}
