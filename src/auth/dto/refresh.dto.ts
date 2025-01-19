import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'The refresh token received during login or previous refresh',
    example: 'some-refresh-token-string',
  })
  refreshToken: string;
}

export class TokenResponseDto {
  @ApiProperty({
    example: 'new-access-token-string',
    description: 'The new access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'new-refresh-token-string',
    description: 'The new refresh token',
  })
  refreshToken: string;

  @ApiProperty({ example: 'user-id-string', description: 'The user ID' })
  userId: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The user email',
  })
  email: string;
}

export class RevokeTokensResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if all tokens were successfully revoked',
  })
  success: boolean;
}
