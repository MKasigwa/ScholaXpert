import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Send email verification email
   */
  async sendVerificationEmail(
    email: string,
    token: string,
    firstName: string,
  ): Promise<void> {
    const verificationUrl = `${this.configService.get('app.frontendUrl')}/verify-email?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ScholaXpert!</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName}!</h2>
              <p>Thank you for registering with ScholaXpert. Please verify your email address to continue.</p>
              <p>Click the button below to verify your email:</p>
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create an account with ScholaXpert, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 ScholaXpert. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Verify Your Email - ScholaXpert',
      html,
      text: `Hello ${firstName}! Please verify your email by clicking this link: ${verificationUrl}`,
    });
  }

  /**
   * Send access request notification to admin
   */
  async sendAccessRequestNotification(
    adminEmail: string,
    requesterName: string,
    tenantName: string,
    role: string,
    requestId: string,
  ): Promise<void> {
    const reviewUrl = `${this.configService.get('app.frontendUrl')}/admin/access-requests/${requestId}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Access Request</h1>
            </div>
            <div class="content">
              <p>A new user has requested access to your school:</p>
              <div class="info-box">
                <p><strong>Requester:</strong> ${requesterName}</p>
                <p><strong>School:</strong> ${tenantName}</p>
                <p><strong>Requested Role:</strong> ${role}</p>
              </div>
              <p>Please review this request:</p>
              <a href="${reviewUrl}" class="button">Review Request</a>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: adminEmail,
      subject: `New Access Request for ${tenantName}`,
      html,
    });
  }

  /**
   * Send access request approval notification
   */
  async sendAccessApprovedNotification(
    userEmail: string,
    userName: string,
    tenantName: string,
    role: string,
  ): Promise<void> {
    const loginUrl = `${this.configService.get('app.frontendUrl')}/login`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; }
            .button { display: inline-block; padding: 15px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Access Request Approved</h1>
            </div>
            <div class="content">
              <h2>Great news, ${userName}!</h2>
              <div class="success">
                <p><strong>Your access request has been approved!</strong></p>
                <p>School: ${tenantName}</p>
                <p>Role: ${role}</p>
              </div>
              <p>You can now log in and access the school management system.</p>
              <a href="${loginUrl}" class="button">Log In Now</a>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: userEmail,
      subject: `Access Approved - ${tenantName}`,
      html,
    });
  }

  /**
   * Send access request rejection notification
   */
  async sendAccessRejectedNotification(
    userEmail: string,
    userName: string,
    tenantName: string,
    reason: string,
  ): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .error { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Access Request Update</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>Your access request to ${tenantName} has been reviewed.</p>
              <div class="error">
                <p><strong>Status:</strong> Not Approved</p>
                <p><strong>Reason:</strong> ${reason}</p>
              </div>
              <p>If you have questions, please contact the school administrator.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: userEmail,
      subject: `Access Request Update - ${tenantName}`,
      html,
    });
  }

  /**
   * Core email sending method (mock for now, replace with real email service)
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  private async sendEmail(options: EmailOptions): Promise<void> {
    // In development, just log the email
    if (this.configService.get('app.env') === 'development') {
      this.logger.log('📧 Email would be sent:');
      this.logger.log(`To: ${options.to}`);
      this.logger.log(`Subject: ${options.subject}`);
      this.logger.log(`Content: ${options.text || 'HTML email'}`);
      return;
    }

    // TODO: Integrate with real email service (SendGrid, AWS SES, etc.)
    // Example with SendGrid:
    // await this.sendgridService.send(options);

    this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
  }
}
