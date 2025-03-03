<<<<<<< HEAD
import { Injectable, UnauthorizedException } from '@nestjs/common';
=======
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
>>>>>>> 0.13
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';

import * as bcrypt from 'bcryptjs';
<<<<<<< HEAD
import { PrismaService } from './prisma.service';
=======
import { RedisService } from './redis.service';
>>>>>>> 0.13

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
<<<<<<< HEAD
    private prisma: PrismaService,
=======
    private redisService: RedisService,
>>>>>>> 0.13
  ) {}

  async validateUser(email: string, password: string) {
    const user: User | null = await this.userService.findUserByEmail(email);
<<<<<<< HEAD
    console.log(user ? '🔎 Usuário encontrado:' : '❌ Usuário não encontrado');

    if (!user) throw new UnauthorizedException('User not found!');
=======
    console.log(
      user ? '🔎 Usuário encontrado!' : '❌ Usuário não encontrado...',
    );

    if (!user) throw new NotFoundException('User not found!');

    if (!user.password) throw new UnauthorizedException('Invalid credentials!');
>>>>>>> 0.13

    console.log('🛠️ Comparando senhas...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔍 Senha bate?: ', isMatch);

    if (isMatch) {
      console.log('✅ Senha correta! Logando...');
      return this.generateTokens(user.id);
    }
    console.log('❌ Senha errada!');

    return null;
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
<<<<<<< HEAD
=======
        role: user.role,
>>>>>>> 0.13
      },
      { expiresIn: '10m' },
    );
    const refreshToken = uuidv4();

    await this.saveRefreshToken(userId, refreshToken);

<<<<<<< HEAD
    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId: number, token: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async findRefreshToken(token: string) {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });
=======
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
>>>>>>> 0.13

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found!');
    }

    return refreshToken;
  }

  async updateRefreshToken(token: string): Promise<object | null> {
    const refreshToken = await this.findRefreshToken(token);

<<<<<<< HEAD
    await this.deleteRefreshToken(refreshToken.token);

    return this.generateTokens(refreshToken.userId);
  }

  async deleteRefreshToken(token: string) {
    return this.prisma.refreshToken.delete({
      where: { token },
    });
=======
    await this.deleteRefreshToken(token);

    const { userId } = JSON.parse(refreshToken) as { userId: number };

    return this.generateTokens(userId);
  }

  async deleteRefreshToken(token: string) {
    await this.redisService.delete(`refreshToken:${token}`);
>>>>>>> 0.13
  }
}
