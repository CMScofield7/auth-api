import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';

import * as bcrypt from 'bcryptjs';
import { RedisService } from './redis.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async validateUser(email: string, password: string) {
    const user: User | null = await this.userService.findUserByEmail(email);

    if (!user) throw new NotFoundException('User not found!');

    if (!user.password) throw new UnauthorizedException('Invalid credentials!');

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return this.generateTokens(user.id);
    }

    throw new UnauthorizedException('Invalid credentials!');
  }

  async generateTokens(userId: number) {
    const user: User | null = await this.userService.findUserByID(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    const accessToken = this.jwtService.sign(
      {
        id: userId,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
      { expiresIn: '10m' },
    );
    const refreshToken = uuidv4();

    await this.saveRefreshToken(userId, refreshToken);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async saveRefreshToken(userId: number, token: string): Promise<void> {
    await this.redisService.set(
      `refreshToken:${token}`,
      JSON.stringify({
        userId,
        token,
      }),
      60 * 60 * 24 * 7,
    );
  }

  async findRefreshToken(token: string): Promise<string> {
    const refreshToken = await this.redisService.get(`refreshToken:${token}`);

    if (!refreshToken) {
      throw new NotFoundException('Refresh token not found!');
    }

    return refreshToken;
  }

  async updateRefreshToken(token: string): Promise<object | null> {
    const refreshToken = await this.findRefreshToken(token);

    await this.deleteRefreshToken(token);

    const { userId } = JSON.parse(refreshToken) as { userId: number };

    return this.generateTokens(userId);
  }

  async deleteRefreshToken(token: string) {
    await this.redisService.delete(`refreshToken:${token}`);
  }
}
