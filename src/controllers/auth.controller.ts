import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDTO } from 'src/DTO/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDTO) {
    const { email, password } = body;
    return await this.authService.validateUser(email, password);
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    const { refresh_token } = body;
    return await this.authService.updateRefreshToken(refresh_token);
  }

  @Post('logout')
  async logout(@Body() body: { refresh_token: string }) {
    const { refresh_token } = body;
    await this.authService.findRefreshToken(refresh_token);
    await this.authService.deleteRefreshToken(refresh_token);

    return { message: 'Successfully logged out!' };
  }
}
