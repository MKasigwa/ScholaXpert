import { registerAs } from '@nestjs/config';

interface DatabaseConfig {
  type: string;
  host: string;
  port: number;
  password: string;
  name: string;
  username: string;
  synchronize: boolean;
  logging: boolean;
  ssl:
    | boolean
    | {
        rejectUnauthorized: boolean;
      };
}

export const databaseConfig = registerAs<DatabaseConfig>(
  'database',
  (): DatabaseConfig => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME || 'scholaxpert',
    password: process.env.DB_PASSWORD || 'password',
    name: process.env.DB_NAME || 'scholaxpert_db',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
  }),
);
