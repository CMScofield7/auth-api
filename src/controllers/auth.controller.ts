<<<<<<< HEAD
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
=======
import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDTO } from 'src/DTO/login.dto';
>>>>>>> 0.13

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
<<<<<<< HEAD
  async login(@Body() body: { email: string; password: string }) {
=======
  async login(@Body() body: LoginDTO) {
>>>>>>> 0.13
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
<<<<<<< HEAD
    return this.authService.deleteRefreshToken(refresh_token);
=======
    await this.authService.deleteRefreshToken(refresh_token);

    return { message: 'Successfully logged out!' };
>>>>>>> 0.13
  }
}
