import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO for Creating Custom Template
export class CreateCustomTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  expiresAt: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountId: string;
}
