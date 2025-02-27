import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest(); // Cria a variavel request, que: 1- chama o contexto da requisição, 2- troca pra http, 3- pega o request

    const token: string | undefined =
      request.headers.authorization?.split(' ')[1]; // Pega o token da requisição

    if (!token) {
      return false;
    }

    try {
      const payload: object = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
      //

      return true;
    } catch (err) {
      console.error('Error verifying token', err);
      return false;
    }
  }
}
