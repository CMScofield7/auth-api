import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Payload } from 'src/interfaces/payload.interface';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const user = request['user'] as Payload;
    const route = request.url;
    const method = request.method;

    //Permite o acesso a POST /register para usuários não autenticados
    if (route === '/register' && method === 'POST' && !user) {
      return true;
    }

    //Bloqueando POST /register pra usuários com id>= 2
    if (route === '/register' && method === 'POST' && user && user.id >= 2) {
      throw new ForbiddenException(
        'Access Denied! You are not allowed to register users!',
      );
    }

    //Permitindo todas as rotas aos IDS 0 e 1
    if (user && user.id === 1) {
      return true;
    }

    //Bloqueando rotas pra id >=2
    if (user && user.id >= 2) {
      //Bloqueia as rotas GET, PUT e DELETE em /users
      if (
        route === '/users' &&
        (method === 'GET' || method === 'PUT' || method === 'DELETE')
      ) {
        throw new ForbiddenException(
          'Access Denied! You are not allowed to use this route!',
        );
      }

      //Permite apenas rotas /users/:id ou /user/:email se o ID ou email for do usuário autenticado
      if (route.startsWith('/users/')) {
        const resourceParams = request.params.param; //Pega o ID ou o email da rota
        const resourceId = request.params.id; //Pega o ID da rota
        console.log('resourceParams', resourceParams);

        if (
          +resourceParams === user.id ||
          resourceParams === user.email ||
          +resourceId === user.id
        ) {
          return true;
        } else {
          throw new ForbiddenException(
            'Access Denied! You are not allowed to use this route if you are not the owner!',
          );
        }
      }
    }

    throw new ForbiddenException('Access Denied!');
  }
}
