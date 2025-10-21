import { registerAs } from '@nestjs/config';

export interface AppConfig {
  env: string;
  port: number;
  frontendUrl: string;
}

export default registerAs<AppConfig>(
  'app',
  (): AppConfig => ({
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  }),
);
