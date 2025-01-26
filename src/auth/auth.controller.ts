import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import {
  RefreshTokenDto,
  TokenResponseDto,
  RevokeTokensResponseDto,
} from './dto/refresh.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or email already exists',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('hit');
    return this.usersService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in an existing user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginUserDto): Promise<TokenResponseDto> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.login(user);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Access token successfully refreshed',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired refresh token' })
  async refreshTokens(
    @Body() body: RefreshTokenDto,
  ): Promise<TokenResponseDto> {
    return this.authService.refreshTokens(body.refreshToken);
  }

  //   @Post('revoke')
  //   @ApiOperation({ summary: 'Revoke all tokens for a user' })
  //   @ApiResponse({ status: 200, description: 'All tokens successfully revoked', type: RevokeTokensResponseDto })
  //   @ApiResponse({ status: 401, description: 'Unauthorized' })
  //   // @UseGuards(JwtAuthGuard) // Uncomment this when guard implementation is ready
  //   async revokeTokens(@Request() req): Promise<RevokeTokensResponseDto> {
  //     await this.authService.revokeAllTokens(req.user.sub);
  //     return { success: true };
  //   }
}
