import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';
import {
  ResendCodeResponseDto,
  ResendVerificationCodeDto,
  VerifyEmailDto,
  VerifyEmailResponseDto,
} from './dto/verify-email.dto';
import {
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto,
  VerifyResetCodeDto,
  VerifyResetCodeResponseDto,
} from './dto/forgot-password.dto';
import { TenantAccessService } from '../tenant-access/tenant-access.service';

@Injectable()
export class AuthService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCK_TIME = 15 * 60 * 1000; // 15 minutes

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly tenantAccessRequestService: TenantAccessService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Generate email verification token
    //const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Generate 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Create new user
    const user = this.userRepository.create({
      ...registerDto,
      email: registerDto.email.toLowerCase(),
      status: UserStatus.PENDING,
      emailVerified: false,
      emailVerificationToken: verificationCode,
      //   emailVerificationToken,
      isFirstLogin: true,
    });

    const savedUser = await this.userRepository.save(user);

    // Send verification email
    // await this.emailService.sendVerificationEmail(
    //   savedUser.email,
    //   emailVerificationToken,
    //   savedUser.firstName,
    // );
    // Send verification code email
    await this.emailService.sendVerificationCode(
      savedUser.email,
      verificationCode,
      savedUser.firstName,
    );

    // Generate tokens
    const tokens = await this.generateTokens(savedUser);

    // Check for pending access requests
    const pendingRequestInfo =
      await this.tenantAccessRequestService.checkPendingAccessRequest(
        savedUser.id,
      );

    return {
      ...tokens,
      user: {
        ...UserResponseDto.fromEntity(savedUser),
        hasPendingRequest: pendingRequestInfo.hasPendingRequest,
        pendingRequestId: pendingRequestInfo.pendingRequestId || null,
      },
    };
  }

  /**
   * Login user with email and password
   */
  async login(
    loginDto: LoginDto,
    ipAddress?: string,
  ): Promise<AuthResponseDto> {
    // Find user with password field
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('LOWER(user.email) = LOWER(:email)', { email: loginDto.email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.isLocked()) {
      const remainingTime = Math.ceil(
        user.lockedUntil
          ? (user.lockedUntil.getTime() - Date.now()) / 60000
          : 0,
      );
      throw new UnauthorizedException(
        `Account is locked. Please try again in ${remainingTime} minutes`,
      );
    }

    // Check if account is suspended or inactive
    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Your account has been suspended');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('Your account is inactive');
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(loginDto.password);

    if (!isPasswordValid) {
      // Increment login attempts
      await this.handleFailedLogin(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset login attempts on successful login
    await this.handleSuccessfulLogin(user, ipAddress);

    // If email is not verified, generate and send a new verification code
    if (!user.emailVerified) {
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      user.emailVerificationToken = verificationCode;
      await this.userRepository.save(user);

      // Send verification code email
      await this.emailService.sendVerificationCode(
        user.email,
        verificationCode,
        user.firstName,
      );
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Check for pending access requests
    const pendingRequestInfo =
      await this.tenantAccessRequestService.checkPendingAccessRequest(user.id);

    return {
      ...tokens,
      user: {
        ...UserResponseDto.fromEntity(user),
        hasPendingRequest: pendingRequestInfo.hasPendingRequest,
        pendingRequestId: pendingRequestInfo.pendingRequestId || null,
      },
    };
  }

  /**
   * Validate user by ID (used by JWT strategy)
   */
  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User account is not active');
    }

    return user;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return UserResponseDto.fromEntity(user);
  }

  /**
   * Generate JWT tokens
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  private async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      expiresIn: 3600, // 1 hour
    };
  }

  /**
   * Handle failed login attempt
   */
  private async handleFailedLogin(user: User): Promise<void> {
    user.loginAttempts += 1;

    if (user.loginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
      user.lockedUntil = new Date(Date.now() + this.LOCK_TIME);
    }

    await this.userRepository.save(user);
  }

  /**
   * Handle successful login
   */
  private async handleSuccessfulLogin(
    user: User,
    ipAddress?: string,
  ): Promise<void> {
    user.loginAttempts = 0;
    user.lockedUntil = undefined;
    user.lastLoginAt = new Date();
    user.lastLoginIp = ipAddress;

    await this.userRepository.save(user);
  }

  /**
   * Refresh access token
   */
  async refreshToken(
    userId: string,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    const user = await this.validateUser(userId);
    return this.generateTokens(user);
  }

  /**
   * Logout user (optional - for token blacklisting)
   */
  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  async logout(userId: string): Promise<{ message: string }> {
    // In a production app, you would blacklist the token here
    // For now, just return success

    return { message: 'Logged out successfully' };
  }

  /**
   * Verify email with token
   */
  async verifyEmail(
    token: string,
  ): Promise<{ message: string; user: UserResponseDto }> {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Update user
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    user.emailVerificationToken = undefined;
    user.status = UserStatus.ACTIVE;

    const updated = await this.userRepository.save(user);

    return {
      message: 'Email verified successfully',
      user: UserResponseDto.fromEntity(updated),
    };
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate new token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = emailVerificationToken;
    await this.userRepository.save(user);

    // Send verification email
    await this.emailService.sendVerificationEmail(
      user.email,
      emailVerificationToken,
      user.firstName,
    );

    return { message: 'Verification email sent' };
  }

  /**
   * Verify email with 6-digit code
   */
  async verifyEmailWithCode(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<VerifyEmailResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: verifyEmailDto.email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      return {
        success: true,
        message: 'Email already verified',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: true,
          emailVerifiedAt: user.emailVerifiedAt,
        },
      };
    }

    // Verify the code matches
    if (user.emailVerificationToken !== verifyEmailDto.code) {
      throw new BadRequestException('Invalid verification code');
    }

    // Update user
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    user.emailVerificationToken = undefined;
    user.status = UserStatus.ACTIVE;

    const updated = await this.userRepository.save(user);

    return {
      success: true,
      message: 'Email verified successfully',
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        emailVerified: true,
        emailVerifiedAt: updated.emailVerifiedAt,
      },
    };
  }

  /**
   * Send 6-digit verification code
   */
  async sendVerificationCode(email: string): Promise<ResendCodeResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate 6-digit code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Store code in emailVerificationToken field
    user.emailVerificationToken = verificationCode;
    await this.userRepository.save(user);

    // Send verification email with code
    await this.emailService.sendVerificationCode(
      user.email,
      verificationCode,
      user.firstName,
    );

    return {
      success: true,
      message: 'Verification code sent successfully',
      expiresIn: 600, // 10 minutes
    };
  }

  /**
   * Resend 6-digit verification code
   */
  async resendVerificationCode(
    resendDto: ResendVerificationCodeDto,
  ): Promise<ResendCodeResponseDto> {
    return this.sendVerificationCode(resendDto.email);
  }

  /**
   * Forgot password
   */
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordDto.email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code in passwordResetToken field
    user.passwordResetToken = resetCode;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.userRepository.save(user);

    // Send reset email with code
    await this.emailService.sendPasswordResetCode(
      user.email,
      resetCode,
      user.firstName,
    );

    return {
      success: true,
      message: 'Password reset code sent successfully',
      expiresIn: 600, // 10 minutes
    };
  }

  /**
   * Verify reset code
   */
  async verifyResetCode(
    verifyResetCodeDto: VerifyResetCodeDto,
  ): Promise<VerifyResetCodeResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: verifyResetCodeDto.email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify the code matches and is still valid
    if (
      user.passwordResetToken !== verifyResetCodeDto.code ||
      (user.passwordResetExpires && user.passwordResetExpires < new Date())
    ) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    return {
      success: true,
      message: 'Reset code verified successfully',
    };
  }

  /**
   * Reset password
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: resetPasswordDto.email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify the code matches and is still valid
    if (
      user.passwordResetToken !== resetPasswordDto.code ||
      (user.passwordResetExpires && user.passwordResetExpires < new Date())
    ) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    // Update user password
    user.password = resetPasswordDto.newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    const updated = await this.userRepository.save(user);
    // await this.userRepository.save(user);

    return {
      success: true,
      message: 'Password reset successfully',
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
      },
    };
  }
}
