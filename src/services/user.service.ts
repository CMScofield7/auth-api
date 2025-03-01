import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from 'src/interfaces/user.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(
    id: number,
    name: string,
    lastname: string,
    email: string,
    password: string,
  ): Promise<string> {
    if (await this.findUserByID(id)) {
      throw new BadRequestException('ID is required');
    }

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
        id,
        name,
        lastname,
        email,
        password: hashedPassword,
      },
    });

    return 'User created successfully!';
  }

  async findUserByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new BadRequestException('Invalid credentials');
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  async findUserByID(id: number): Promise<User | null> {
    if (!id) {
      throw new BadRequestException('Invalid credentials');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
  }

  async findUsers(): Promise<User[]> {
    if (!this.prisma) {
      throw new BadRequestException('Prisma is not initialized');
    }

    const users = await this.prisma.user.findMany();
    return users;
  }

  async updateUser(
    id: number,
    email: string,
    password: string,
  ): Promise<object> {
    if (!id) {
      throw new BadRequestException('Invalid credentials');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email,
        password: hashedPassword,
      },
    });

    return user;
  }

  async deleteUser(id: number): Promise<object> {
    if (!id) {
      throw new BadRequestException('Invalid credentials');
    }

    const user = await this.prisma.user.delete({ where: { id } });
    return user;
  }

  async deleteAllUsers() {
    const users = await this.prisma.user.deleteMany();
    return users;
  }
}
