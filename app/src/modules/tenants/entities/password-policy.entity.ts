import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('password_policies')
export class PasswordPolicy extends BaseEntity {
  @ApiProperty({ description: 'Minimum password length', example: 8 })
  @Column({ type: 'int', default: 8 })
  minLength: number;

  @ApiProperty({ description: 'Require uppercase letters', example: true })
  @Column({ type: 'boolean', default: true })
  requireUppercase: boolean;

  @ApiProperty({ description: 'Require lowercase letters', example: true })
  @Column({ type: 'boolean', default: true })
  requireLowercase: boolean;

  @ApiProperty({ description: 'Require numbers', example: true })
  @Column({ type: 'boolean', default: true })
  requireNumbers: boolean;

  @ApiProperty({ description: 'Require special characters', example: true })
  @Column({ type: 'boolean', default: true })
  requireSpecialChars: boolean;

  @ApiProperty({ description: 'Prohibit common passwords', example: true })
  @Column({ type: 'boolean', default: true })
  prohibitCommonPasswords: boolean;

  @ApiProperty({
    description: 'Password expiry in days (0 = never)',
    example: 90,
  })
  @Column({ type: 'int', default: 0 })
  passwordExpiry: number;
}
