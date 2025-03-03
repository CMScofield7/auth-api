import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import { UserModule } from '../user/user.module';
import { AuthController } from 'src/controllers/auth.controller';
import { PrismaService } from 'src/services/prisma.service';
import { RedisService } from 'src/services/redis.service';
@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [UserService, AuthService, PrismaService, RedisService],
  exports: [JwtModule],
})
export class AuthModule {
  constructor() {}
}
