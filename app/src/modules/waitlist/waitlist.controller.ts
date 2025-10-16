import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  HttpCode,
  HttpStatus,
  Req,
  Header,
} from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { SubscriberQueryDto } from './dto/subscriber-query.dto';
import {
  SubscriberResponseDto,
  SubscriberStatsDto,
} from './dto/subscriber-response.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import type { Request } from 'express';

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  /**
   * Subscribe to waitlist (public endpoint)
   * POST /api/waitlist/subscribe
   */
  @Post('subscribe')
  @HttpCode(HttpStatus.CREATED)
  async subscribe(
    @Body() createSubscriberDto: CreateSubscriberDto,
    @Req() request: Request,
  ): Promise<SubscriberResponseDto> {
    // Capture IP address and user agent
    const ipAddress =
      (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      request.socket.remoteAddress;
    const userAgent = request.headers['user-agent'];

    return this.waitlistService.subscribe({
      ...createSubscriberDto,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Get all subscribers with pagination and filtering (admin endpoint)
   * GET /api/waitlist/subscribers
   */
  @Get('subscribers')
  async findAll(
    @Query() query: SubscriberQueryDto,
  ): Promise<PaginatedResponseDto<SubscriberResponseDto>> {
    return this.waitlistService.findAll(query);
  }

  /**
   * Get waitlist statistics (admin endpoint)
   * GET /api/waitlist/stats
   */
  @Get('stats')
  async getStats(): Promise<SubscriberStatsDto> {
    return this.waitlistService.getStats();
  }

  /**
   * Export subscribers to CSV (admin endpoint)
   * GET /api/waitlist/export/csv
   */
  @Get('export/csv')
  @Header('Content-Type', 'text/csv')
  @Header(
    'Content-Disposition',
    'attachment; filename="waitlist-subscribers.csv"',
  )
  async exportToCsv(): Promise<string> {
    return this.waitlistService.exportToCsv();
  }

  /**
   * Get single subscriber by ID (admin endpoint)
   * GET /api/waitlist/subscribers/:id
   */
  @Get('subscribers/:id')
  async findOne(@Param('id') id: string): Promise<SubscriberResponseDto> {
    return this.waitlistService.findOne(id);
  }

  /**
   * Get subscriber by email (admin endpoint)
   * GET /api/waitlist/subscribers/email/:email
   */
  @Get('subscribers/email/:email')
  async findByEmail(
    @Param('email') email: string,
  ): Promise<SubscriberResponseDto | null> {
    return this.waitlistService.findByEmail(email);
  }

  /**
   * Mark subscriber as notified (admin endpoint)
   * PATCH /api/waitlist/subscribers/:id/notify
   */
  @Patch('subscribers/:id/notify')
  async markAsNotified(
    @Param('id') id: string,
  ): Promise<SubscriberResponseDto> {
    return this.waitlistService.markAsNotified(id);
  }

  /**
   * Bulk mark subscribers as notified (admin endpoint)
   * PATCH /api/waitlist/subscribers/notify/bulk
   */
  @Patch('subscribers/notify/bulk')
  async markManyAsNotified(
    @Body() body: { ids: string[] },
  ): Promise<{ updated: number }> {
    return this.waitlistService.markManyAsNotified(body.ids);
  }

  /**
   * Unsubscribe by ID (admin endpoint)
   * PATCH /api/waitlist/subscribers/:id/unsubscribe
   */
  @Patch('subscribers/:id/unsubscribe')
  async unsubscribe(@Param('id') id: string): Promise<SubscriberResponseDto> {
    return this.waitlistService.unsubscribe(id);
  }

  /**
   * Unsubscribe by email (public endpoint)
   * POST /api/waitlist/unsubscribe
   */
  @Post('unsubscribe')
  @HttpCode(HttpStatus.OK)
  async unsubscribeByEmail(
    @Body() body: { email: string },
  ): Promise<SubscriberResponseDto> {
    return this.waitlistService.unsubscribeByEmail(body.email);
  }

  /**
   * Delete subscriber (admin endpoint)
   * DELETE /api/waitlist/subscribers/:id
   */
  @Delete('subscribers/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.waitlistService.remove(id);
  }
}
