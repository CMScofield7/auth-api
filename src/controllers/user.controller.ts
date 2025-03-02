import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from 'src/DTO/create-user.dto';
import { User } from 'src/interfaces/user.interface';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Payload } from 'src/interfaces/payload.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UseGuards(RoleGuard)
  async createUser(@Body() body: CreateUserDTO): Promise<string> {
    const { name, lastname, email, password, role } = body;
    return await this.userService.createUser(
      name,
      lastname,
      email,
      password,
      role,
    );
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findUsers(): Promise<User[]> {
    return await this.userService.findUsers();
  }

  @Get('users/me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: { user: Payload }): Payload {
    return {
      id: req.user.id,
      name: req.user.name,
      lastname: req.user.lastname,
      email: req.user.email,
      role: req.user.role,
    };
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findUserByID(
    @Param('id') id: string,
  ): Promise<User | { message: string } | null> {
    if (!isNaN(Number(id))) return await this.userService.findUserByID(+id);

    return { message: 'Invalid credentials' };
  }

  @Put('users/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() body: { email: string; password: string },
  ): Promise<object> {
    const { email, password } = body;

    return await this.userService.updateUser(+id, email, password);
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteUser(@Param('id') id: string): Promise<object> {
    await this.userService.deleteUser(+id);

    return {
      message: 'User deleted successfully',
    };
  }

  @Delete('users')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteAllUsers(): Promise<object> {
    const users = await this.userService.deleteAllUsers();

    if (users.count === 0) {
      return {
        message: 'Users not found',
      };
    }

    return {
      message: 'Users deleted successfully',
    };
  }
}
