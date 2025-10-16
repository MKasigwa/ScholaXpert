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

@Injectable()
export class AuthService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCK_TIME = 15 * 60 * 1000; // 15 minutes

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
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
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create new user
    const user = this.userRepository.create({
      ...registerDto,
      email: registerDto.email.toLowerCase(),
      status: UserStatus.PENDING,
      emailVerified: false,
      emailVerificationToken,
      isFirstLogin: true,
    });

    const savedUser = await this.userRepository.save(user);

    // Send verification email
    await this.emailService.sendVerificationEmail(
      savedUser.email,
      emailVerificationToken,
      savedUser.firstName,
    );

    // Generate tokens
    const tokens = await this.generateTokens(savedUser);

    return {
      ...tokens,
      user: UserResponseDto.fromEntity(savedUser),
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

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: UserResponseDto.fromEntity(user),
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
}
