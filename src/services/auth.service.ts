import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/interfaces/user.interface';
import { Payload } from 'src/interfaces/payload.interface';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user: User | null = await this.userService.findUserByEmail(email);
    console.log('🔎 Usuário encontrado:', user);

    if (!user) {
      console.log('❌ Usuário não encontrado');
      return null;
    }

    console.log('🛠️ Comparando senhas...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔍 Senha bate?: ', isMatch);

    if (user && isMatch) {
      console.log('✅ Senha correta! Logando...');
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
      };
    }
    console.log('❌ Senha errada!');
    return null;
  }

  generateTokens(payload: Payload) {
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }
}
