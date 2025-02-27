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

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
      };
    }

    return null;
  }

  generateToken(payload: Payload) {
    return this.jwtService.sign(payload);
  }
}
