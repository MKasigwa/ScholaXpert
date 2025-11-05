import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantAccessController } from './tenant-access.controller';
import { TenantAccessService } from './tenant-access.service';
import { TenantAccessRequest } from './entities/tenant-access-request.entity';
import { User } from '../users/entities/user.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TenantAccessRequest, User, Tenant]),
    EmailModule,
  ],
  controllers: [TenantAccessController],
  providers: [TenantAccessService],
  exports: [TenantAccessService],
})
export class TenantAccessModule {}
