import { forwardRef, Module } from '@nestjs/common';
import { UserController } from 'src/controllers/user.controller';
import { UserService } from 'src/services/user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
<<<<<<< HEAD
=======
import { RedisService } from 'src/services/redis.service';
import { MailService } from 'src/services/mail.service';
>>>>>>> 0.13

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
<<<<<<< HEAD
  providers: [UserService],
  exports: [UserService],
=======
  providers: [UserService, RedisService, MailService],
  exports: [UserService, MailService],
>>>>>>> 0.13
})
export class UserModule {}
