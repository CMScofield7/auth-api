import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDTO } from 'src/DTO/create-user.dto';
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
  ): Promise<CreateUserDTO> {
    if (await this.findUserByID(id)) {
      throw new HttpException(
        'User with this ID already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (await this.findUserByEmail(email)) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      await this.prisma.user.findFirst({
        where: {
          name,
          lastname,
        },
      })
    ) {
      throw new HttpException(
        'This user already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const user = await this.prisma.user.create({
      data: {
        id,
        name,
        lastname,
        email,
        password: hashedPassword,
      },
    });

    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  async findUserByID(id: number): Promise<User | null> {
    if (!id) {
      throw new HttpException('ID is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
  }

  async findUsers(): Promise<User[]> {
    if (!this.prisma) {
      throw new HttpException(
        'Prisma is not initialized',
        HttpStatus.BAD_REQUEST,
      );
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
      throw new HttpException('ID is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email,
        password,
      },
    });
    return user;
  }

  async deleteUser(id: number): Promise<object> {
    if (!id) {
      throw new HttpException('ID is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.delete({ where: { id } });
    return user;
  }

  async deleteAllUsers() {
    const users = await this.prisma.user.deleteMany();
    return users;
  }
}
