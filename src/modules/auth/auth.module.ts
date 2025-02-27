import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import { UserModule } from '../user/user.module';
import { AuthController } from 'src/controllers/auth.controller';
import { PrismaService } from 'src/services/prisma.service';
import { env } from 'process';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Substitua por uma chave segura
      signOptions: { expiresIn: '1h' }, // Opcional: tempo de expiração do token
    }),
  ],
  controllers: [AuthController],
  providers: [UserService, AuthService, PrismaService],
  exports: [JwtModule],
})
export class AuthModule {
  constructor() {}
}
