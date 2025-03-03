import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import { UserModule } from '../user/user.module';
import { AuthController } from 'src/controllers/auth.controller';
import { PrismaService } from 'src/services/prisma.service';
<<<<<<< HEAD
=======
import { RedisService } from 'src/services/redis.service';
>>>>>>> 0.13
@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
<<<<<<< HEAD
  providers: [UserService, AuthService, PrismaService],
=======
  providers: [UserService, AuthService, PrismaService, RedisService],
>>>>>>> 0.13
  exports: [JwtModule],
})
export class AuthModule {
  constructor() {}
}
