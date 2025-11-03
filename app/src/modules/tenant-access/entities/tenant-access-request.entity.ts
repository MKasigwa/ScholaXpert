import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User, UserRole } from '../../users/entities/user.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

export enum AccessRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('tenant_access_requests')
@Index(['userId'])
@Index(['tenantId'])
@Index(['status'])
@Index(['createdAt'])
export class TenantAccessRequest extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant, { eager: true })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  requestedRole: UserRole;

  @Column({
    type: 'enum',
    enum: AccessRequestStatus,
    default: AccessRequestStatus.PENDING,
  })
  status: AccessRequestStatus;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ type: 'uuid', nullable: true })
  reviewedBy?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewedBy' })
  reviewer?: User;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt?: Date;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}
