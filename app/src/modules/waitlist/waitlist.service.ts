import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import {
  WaitlistSubscriber,
  SubscriberStatus,
} from './entities/waitlist-subscriber.entity';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { SubscriberQueryDto } from './dto/subscriber-query.dto';
import {
  SubscriberResponseDto,
  SubscriberStatsDto,
} from './dto/subscriber-response.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

@Injectable()
export class WaitlistService {
  constructor(
    @InjectRepository(WaitlistSubscriber)
    private readonly subscriberRepository: Repository<WaitlistSubscriber>,
  ) {}

  /**
   * Subscribe a new email to the waitlist
   */
  async subscribe(
    createDto: CreateSubscriberDto,
  ): Promise<SubscriberResponseDto> {
    // Check if email already exists
    const existingSubscriber = await this.subscriberRepository.findOne({
      where: { email: createDto.email.toLowerCase() },
    });

    if (existingSubscriber) {
      // If previously unsubscribed, reactivate
      if (existingSubscriber.status === SubscriberStatus.UNSUBSCRIBED) {
        existingSubscriber.status = SubscriberStatus.ACTIVE;
        existingSubscriber.unsubscribedAt = undefined;
        const updated =
          await this.subscriberRepository.save(existingSubscriber);
        return SubscriberResponseDto.fromEntity(updated);
      }

      throw new ConflictException(
        'This email is already subscribed to the waitlist',
      );
    }

    // Create new subscriber
    const subscriber = this.subscriberRepository.create({
      ...createDto,
      email: createDto.email.toLowerCase(),
    });

    const saved = await this.subscriberRepository.save(subscriber);
    return SubscriberResponseDto.fromEntity(saved);
  }

  /**
   * Get all subscribers with pagination and filtering
   */
  async findAll(
    query: SubscriberQueryDto,
  ): Promise<PaginatedResponseDto<SubscriberResponseDto>> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortDirection = 'DESC',
      status,
      source,
      startDate,
      endDate,
      country,
      locale,
    } = query;

    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');

    // Apply filters
    if (search) {
      queryBuilder.andWhere(
        '(subscriber.email LIKE :search OR subscriber.firstName LIKE :search OR subscriber.lastName LIKE :search OR subscriber.organization LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('subscriber.status = :status', { status });
    }

    if (source) {
      queryBuilder.andWhere('subscriber.source = :source', { source });
    }

    if (country) {
      queryBuilder.andWhere('subscriber.country = :country', { country });
    }

    if (locale) {
      queryBuilder.andWhere('subscriber.locale = :locale', { locale });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'subscriber.createdAt BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    } else if (startDate) {
      queryBuilder.andWhere('subscriber.createdAt >= :startDate', {
        startDate,
      });
    } else if (endDate) {
      queryBuilder.andWhere('subscriber.createdAt <= :endDate', { endDate });
    }

    // Apply sorting
    queryBuilder.orderBy(`subscriber.${sortBy}`, sortDirection);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [subscribers, total] = await queryBuilder.getManyAndCount();

    return {
      data: subscribers.map((sub) => SubscriberResponseDto.fromEntity(sub)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    };
  }

  /**
   * Get a single subscriber by ID
   */
  async findOne(id: string): Promise<SubscriberResponseDto> {
    const subscriber = await this.subscriberRepository.findOne({
      where: { id },
    });

    if (!subscriber) {
      throw new NotFoundException(`Subscriber with ID ${id} not found`);
    }

    return SubscriberResponseDto.fromEntity(subscriber);
  }

  /**
   * Get subscriber by email
   */
  async findByEmail(email: string): Promise<SubscriberResponseDto | null> {
    const subscriber = await this.subscriberRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    return subscriber ? SubscriberResponseDto.fromEntity(subscriber) : null;
  }

  /**
   * Mark subscriber as notified
   */
  async markAsNotified(id: string): Promise<SubscriberResponseDto> {
    const subscriber = await this.subscriberRepository.findOne({
      where: { id },
    });

    if (!subscriber) {
      throw new NotFoundException(`Subscriber with ID ${id} not found`);
    }

    subscriber.status = SubscriberStatus.NOTIFIED;
    subscriber.notifiedAt = new Date();

    const updated = await this.subscriberRepository.save(subscriber);
    return SubscriberResponseDto.fromEntity(updated);
  }

  /**
   * Bulk mark subscribers as notified
   */
  async markManyAsNotified(ids: string[]): Promise<{ updated: number }> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('No subscriber IDs provided');
    }

    const result = await this.subscriberRepository
      .createQueryBuilder()
      .update(WaitlistSubscriber)
      .set({
        status: SubscriberStatus.NOTIFIED,
        notifiedAt: new Date(),
      })
      .where('id IN (:...ids)', { ids })
      .execute();

    return { updated: result.affected || 0 };
  }

  /**
   * Unsubscribe a subscriber
   */
  async unsubscribe(id: string): Promise<SubscriberResponseDto> {
    const subscriber = await this.subscriberRepository.findOne({
      where: { id },
    });

    if (!subscriber) {
      throw new NotFoundException(`Subscriber with ID ${id} not found`);
    }

    subscriber.status = SubscriberStatus.UNSUBSCRIBED;
    subscriber.unsubscribedAt = new Date();

    const updated = await this.subscriberRepository.save(subscriber);
    return SubscriberResponseDto.fromEntity(updated);
  }

  /**
   * Unsubscribe by email
   */
  async unsubscribeByEmail(email: string): Promise<SubscriberResponseDto> {
    const subscriber = await this.subscriberRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!subscriber) {
      throw new NotFoundException(`Subscriber with email ${email} not found`);
    }

    return this.unsubscribe(subscriber.id);
  }

  /**
   * Delete a subscriber
   */
  async remove(id: string): Promise<void> {
    const subscriber = await this.subscriberRepository.findOne({
      where: { id },
    });

    if (!subscriber) {
      throw new NotFoundException(`Subscriber with ID ${id} not found`);
    }

    await this.subscriberRepository.remove(subscriber);
  }

  /**
   * Get waitlist statistics
   */
  async getStats(): Promise<SubscriberStatsDto> {
    const [total, active, notified, unsubscribed, allSubscribers] =
      await Promise.all([
        this.subscriberRepository.count(),
        this.subscriberRepository.count({
          where: { status: SubscriberStatus.ACTIVE },
        }),
        this.subscriberRepository.count({
          where: { status: SubscriberStatus.NOTIFIED },
        }),
        this.subscriberRepository.count({
          where: { status: SubscriberStatus.UNSUBSCRIBED },
        }),
        this.subscriberRepository.find(),
      ]);

    // Calculate recent signups (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSignups = await this.subscriberRepository.count({
      where: {
        createdAt: Between(sevenDaysAgo, new Date()),
      },
    });

    // Group by source
    const bySource: Record<string, number> = {};
    allSubscribers.forEach((sub) => {
      bySource[sub.source] = (bySource[sub.source] || 0) + 1;
    });

    // Group by country
    const byCountry: Record<string, number> = {};
    allSubscribers.forEach((sub) => {
      if (sub.country) {
        byCountry[sub.country] = (byCountry[sub.country] || 0) + 1;
      }
    });

    return {
      total,
      active,
      notified,
      unsubscribed,
      bySource,
      byCountry,
      recentSignups,
    };
  }

  /**
   * Export subscribers to CSV format
   */
  async exportToCsv(): Promise<string> {
    const subscribers = await this.subscriberRepository.find({
      order: { createdAt: 'DESC' },
    });

    const headers = [
      'ID',
      'Email',
      'First Name',
      'Last Name',
      'Organization',
      'Role',
      'Phone',
      'Country',
      'Status',
      'Source',
      'Locale',
      'Created At',
      'Notified At',
    ].join(',');

    const rows = subscribers.map((sub) =>
      [
        sub.id,
        sub.email,
        sub.firstName || '',
        sub.lastName || '',
        sub.organization || '',
        sub.role || '',
        sub.phoneNumber || '',
        sub.country || '',
        sub.status,
        sub.source,
        sub.locale || '',
        sub.createdAt.toISOString(),
        sub.notifiedAt ? sub.notifiedAt.toISOString() : '',
      ].join(','),
    );

    return [headers, ...rows].join('\n');
  }
}
