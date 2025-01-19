import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional() // Optional since the user may not want to update their first name
  @IsString()
  firstName?: string;

  @ApiProperty()
  @IsOptional() // Optional field
  @IsString()
  lastName?: string;

  @ApiProperty()
  @IsOptional() // Optional field
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional() // Optional field
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;
}
