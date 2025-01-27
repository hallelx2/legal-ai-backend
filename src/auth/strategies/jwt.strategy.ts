import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      // Extract JWT from the Authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Automatically handle token expiration
      ignoreExpiration: false,
      // Use the secret from environment variables
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  // This method is called after token is verified
  async validate(payload: any) {
    // Payload contains the data we included when creating the token
    console.log('JWT Payload:', payload);
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Return the user object that will be attached to Request
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
