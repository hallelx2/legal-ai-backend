import { Injectable } from '@nestjs/common';
import { CreateDocusignDto } from './dto/create-docusign.dto';
import { UpdateDocusignDto } from './dto/update-docusign.dto';
import { btoa } from 'buffer';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthToken } from './auth-token-schema';
import { CodeDto } from './docusign.controller';

@Injectable()
export class DocusignService {
  constructor(
    @InjectModel(AuthToken.name)
    private authTokenModel: Model<AuthToken>,
  ) {}

  private readonly CLIENT_ID = process.env.DOCUSIGN_CLIENT_ID;
  private readonly CLIENT_SECRET = process.env.DOCUSIGN_CLIENT_SECRET;
  private readonly REDIRECT_URI = process.env.DOCUSIGN_REDIRECT_URI;
  private readonly AUTH_SERVER =
    process.env.DOCUSIGN_AUTH_SERVER || 'account-d.docusign.com';

  async createToken(CodeDto: CodeDto) {
    const authorization = btoa(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`);
    console.log(authorization);
    console.log(CodeDto.code);
    try {
      const response = await fetch(
        `https://account-d.docusign.com/oauth/token`,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authorization}`,
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            code: CodeDto.code,
          }),
        },
      );
      console.log(response);

      if (!response.ok) {
        throw new Error('code expired');
      }
      const data = await response.json();
      console.log(data);
      return await this.saveTokens(
        CodeDto.user_id,
        data.access_token,
        data.refresh_token,
        data.expires_in,
      );
    } catch (error) {
      throw new Error(error);
      console.log(error);
    }
  }

  async saveTokens(
    userId: string,
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
  ): Promise<AuthToken> {
    // Remove existing tokens for the user
    console.log(userId, accessToken);

    await this.authTokenModel.deleteMany({ userId });

    // Create new token entry
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    const tokenEntry = new this.authTokenModel({
      userId,
      accessToken,
      refreshToken,
      expiresAt,
    });

    return tokenEntry.save();
  }

  async refreshAccessToken(CodeDto: CodeDto): Promise<AuthToken | null> {
    const existingToken = await this.authTokenModel.findOne({
      refreshToken: CodeDto.code,
    });

    if (!existingToken) {
      return null;
    }

    // Here you would typically call your authentication provider's token refresh endpoint
    // This is a placeholder for that logic
    const data = await this.fetchNewTokensFromProvider(CodeDto.code);
    if (!data) return null;
    return this.saveTokens(
      CodeDto.user_id,
      data.access_token,
      data.refresh_token,
      data.expires_in,
    );
  }

  private async fetchNewTokensFromProvider(refreshToken: string) {
    // Implement actual token refresh logic with your authentication provider
    // This is where you'd make an HTTP request to get new tokens
    // Returns an object with { accessToken, refreshToken, expiresIn }
    const authorization = btoa(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`);
    console.log(authorization);
    try {
      const response = await fetch(
        `https://account-d.docusign.com/oauth/token`,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authorization}`,
          },
          body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          }),
        },
      );
      if (!response.ok) {
        throw new Error('');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getActiveTokenForUser(userId: string): Promise<AuthToken | null> {
    try {
      const activeToken = this.authTokenModel.findOne({
        userId,
        expiresAt: { $gt: new Date() },
      });
      console.log(activeToken);

      if (!activeToken) {
        const existingToken = await this.authTokenModel.findOne({ userId });
        const newToken = await this.refreshAccessToken({
          code: existingToken.refreshToken,
          user_id: existingToken.userId,
        });
        return newToken;
      }
      return await activeToken;
    } catch (error) {
      return null;
    }
  }
}
