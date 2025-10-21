import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('api_settings')
export class ApiSettings extends BaseEntity {
  @ApiProperty({ description: 'API enabled', example: false })
  @Column({ type: 'boolean', default: false })
  enabled: boolean;

  @ApiProperty({ description: 'API version', example: 'v1' })
  @Column({ length: 10, default: 'v1' })
  version: string;

  @ApiProperty({ description: 'Rate limit per minute', example: 60 })
  @Column({ type: 'int', default: 60 })
  rateLimit: number;

  @ApiProperty({
    description: 'Allowed origins',
    example: ['https://app.school.com'],
  })
  @Column({ type: 'text', array: true, default: '{}' })
  allowedOrigins: string[];

  @ApiProperty({
    description: 'Webhook endpoints',
    example: ['https://webhook.school.com/api'],
  })
  @Column({ type: 'text', array: true, default: '{}' })
  webhookEndpoints: string[];

  @ApiProperty({ description: 'API keys (encrypted)', example: ['key_xxx'] })
  @Column({ type: 'text', array: true, default: '{}' })
  apiKeys: string[];
}
