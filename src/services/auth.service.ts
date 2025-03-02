import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';

import * as bcrypt from 'bcryptjs';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user: User | null = await this.userService.findUserByEmail(email);
    console.log(user ? '🔎 Usuário encontrado:' : '❌ Usuário não encontrado');

    if (!user) throw new UnauthorizedException('User not found!');

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
      },
      { expiresIn: '10m' },
    );
    const refreshToken = uuidv4();

    await this.saveRefreshToken(userId, refreshToken);

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

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found!');
    }

    return refreshToken;
  }

  async updateRefreshToken(token: string): Promise<object | null> {
    const refreshToken = await this.findRefreshToken(token);

    await this.deleteRefreshToken(refreshToken.token);

    return this.generateTokens(refreshToken.userId);
  }

  async deleteRefreshToken(token: string) {
    return this.prisma.refreshToken.delete({
      where: { token },
    });
  }
}
