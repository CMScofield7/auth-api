import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, RedisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
