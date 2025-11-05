import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * POST /api/auth/register
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() request: Request,
  ): Promise<AuthResponseDto> {
    const ipAddress =
      (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      request.socket.remoteAddress;

    return this.authService.login(loginDto, ipAddress);
  }

  /**
   * Get current authenticated user
   * GET /api/auth/me
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(
    @CurrentUser('userId') userId: string,
  ): Promise<UserResponseDto> {
    return this.authService.getUserById(userId);
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@CurrentUser('userId') userId: string) {
    return this.authService.refreshToken(userId);
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser('userId') userId: string) {
    return this.authService.logout(userId);
  }

  /**
   * Verify email with token
   * POST /api/auth/verify-email
   */
  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() body: { token: string }) {
    return this.authService.verifyEmail(body.token);
  }

  /**
   * Resend verification email
   * POST /api/auth/resend-verification
   */
  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() body: { email: string }) {
    return this.authService.resendVerificationEmail(body.email);
  }

  /**
   * Verify email with 6-digit code
   * POST /api/auth/verify-email-code
   */
  @Public()
  @Post('verify-email-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email with 6-digit code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verified successfully',
    type: VerifyEmailResponseDto,
  })
  async verifyEmailWithCode(
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<VerifyEmailResponseDto> {
    return this.authService.verifyEmailWithCode(verifyEmailDto);
  }

  /**
   * Send verification code
   * POST /api/auth/send-verification-code
   */
  @Public()
  @Post('send-verification-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send 6-digit verification code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verification code sent successfully',
    type: ResendCodeResponseDto,
  })
  async sendVerificationCode(
    @Body() body: { email: string },
  ): Promise<ResendCodeResponseDto> {
    return this.authService.sendVerificationCode(body.email);
  }

  /**
   * Resend verification code
   * POST /api/auth/resend-verification-code
   */
  @Public()
  @Post('resend-verification-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend 6-digit verification code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verification code sent successfully',
    type: ResendCodeResponseDto,
  })
  async resendVerificationCode(
    @Body() resendDto: ResendVerificationCodeDto,
  ): Promise<ResendCodeResponseDto> {
    return this.authService.resendVerificationCode(resendDto);
  }

  /**
   * Forgot password
   * POST /api/auth/forgot-password
   */
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Forgot password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Forgot password request sent successfully',
    type: ForgotPasswordResponseDto,
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponseDto> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  /**
   * Verify reset code
   * POST /api/auth/verify-reset-code
   */
  @Public()
  @Post('verify-reset-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify reset code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reset code verified successfully',
    type: VerifyResetCodeResponseDto,
  })
  async verifyResetCode(
    @Body() verifyResetCodeDto: VerifyResetCodeDto,
  ): Promise<VerifyResetCodeResponseDto> {
    return this.authService.verifyResetCode(verifyResetCodeDto);
  }

  /**
   * Reset password
   * POST /api/auth/reset-password
   */
  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successfully',
    type: ResetPasswordResponseDto,
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
