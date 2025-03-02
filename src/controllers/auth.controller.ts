import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    return await this.authService.validateUser(email, password);
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    return await this.authService.findAndUpdateRefreshToken(body.refresh_token);
  }

  @Post('logout')
  async logout(@Body() body: { refresh_token: string }) {
    const { refresh_token } = body;

    return this.authService.deleteRefreshToken(refresh_token);
  }
}
