import { forwardRef, Module } from '@nestjs/common';
import { UserController } from 'src/controllers/user.controller';
import { UserService } from 'src/services/user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RedisService } from 'src/services/redis.service';
import { MailService } from 'src/services/mail.service';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, RedisService, MailService],
  exports: [UserService, MailService],
})
export class UserModule {}
