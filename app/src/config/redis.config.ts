import { registerAs } from '@nestjs/config';

interface DatabaseConfig {
  host: string;
  port: number;
  password: string | undefined;
  ttl: number;
}

export const redisConfig = registerAs<DatabaseConfig>('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  ttl: process.env.REDIS_TTL ? parseInt(process.env.REDIS_TTL, 10) : 3600, // 1 hour
}));
