import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') as string,
    });
  }

  async validate(payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const user = await this.authService.validateUser(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      userId: payload.sub as string,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      email: payload.email as string,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      role: payload.role as string,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      tenantId: payload.tenantId as string,
    };
  }
}
