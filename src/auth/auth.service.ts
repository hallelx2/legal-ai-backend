import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schemas/user.schemas';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  email: string;
  sub: string;
  tokenVersion: number;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
}

export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    throw new UnauthorizedException('Invalid Credentials');
  }

  async login(user: Omit<User, 'password'>): Promise<LoginResponse> {
    const tokens = await this.getTokens(user._id.toString(), user.email);
    console.log(tokens);
    return {
      ...tokens,
      userId: user._id.toString(),
      email: user.email,
    };
  }

  async getTokens(userId: string, email: string): Promise<TokenPayload> {
    const user = await this.usersService.findUserByEmail(email);
    const tokenVersion = user.tokenVersion || 0;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          tokenVersion,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '3h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          tokenVersion,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string): Promise<LoginResponse> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        },
      );
      const user = await this.usersService.findUserByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user.tokenVersion !== payload.tokenVersion) {
        throw new UnauthorizedException('Invalid token');
      }
      const tokens = await this.getTokens(payload.sub, payload.email);
      return {
        ...tokens,
        userId: user._id.toString(),
        email: user.email,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeAllTokens(userId: string): Promise<void> {
    await this.usersService.incrementTokenVersion(userId);
  }
}
