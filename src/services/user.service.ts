import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from 'src/interfaces/user.interface';
import * as bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { RedisService } from './redis.service';
import { MailService } from './mail.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private mailService: MailService,
  ) {}

  async createUser(
    name: string,
    lastname: string,
    email: string,
    password: string,
    role: string,
  ): Promise<string> {
    if (await this.findUserByEmail(email)) {
      throw new BadRequestException('User already exists');
    }

    if (
      await this.prisma.user.findFirst({
        where: {
          name,
          lastname,
        },
      })
    ) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        name,
        lastname,
        email,
        password: hashedPassword,
        role,
      },
    });

    return 'User created successfully!';
  }

  async findUserByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new BadRequestException('Invalid credentials');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async findUserByID(id: number): Promise<User | null> {
    if (!id) {
      throw new BadRequestException('Invalid credentials');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async findUsers(): Promise<User[]> {
    if (!this.prisma) {
      throw new BadRequestException('Prisma is not initialized');
    }

    const users = await this.prisma.user.findMany({ omit: { password: true } });
    return users;
  }

  async changeEmail(email: string): Promise<object> {
    if (!email) {
      throw new BadRequestException('Invalid credentials');
    }

    const user = await this.prisma.user.update({
      where: { email },
      data: {
        email,
      },
    });

    return user;
  }

  async changePassword(
    id: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<object> {
    const user = await this.findUserByID(id);

    if (!user) throw new NotFoundException('User not found');
    if (!user.password) throw new BadRequestException('Invalid data!');

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  }

  async forgotPassword(email: string): Promise<object> {
    const user = await this.findUserByEmail(email);

    if (user) {
      const resetToken = nanoid(64);
      await this.redisService.set(
        `resetToken:${resetToken}`,
        JSON.stringify({
          userId: user.id,
          token: resetToken,
        }),
        60 * 60 * 8,
      );

      //Manda o email com o link
      await this.mailService.sendPasswordResetEmail(email, resetToken);
    }

    return { message: 'Email sent successfully' };
  }

  async resetPassword(
    resetToken: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const token = await this.redisService.get(`resetToken:${resetToken}`);
    if (!token) {
      throw new BadRequestException('Invalid link!');
    }

    const { userId } = JSON.parse(token) as { userId: number };
    const user = await this.findUserByID(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: user.password,
      },
    });

    return { message: 'Password reset successfully' };
  }

  async deleteUser(id: number): Promise<object> {
    if (!id) {
      throw new BadRequestException('Invalid credentials');
    }

    const user = await this.prisma.user.delete({ where: { id } });
    return user;
  }

  async deleteAllUsers(): Promise<{
    count: number;
  }> {
    return await this.prisma.user.deleteMany();
  }
}
