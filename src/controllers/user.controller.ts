import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from 'src/DTO/create-user.dto';
import { User } from 'src/interfaces/user.interface';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UseGuards(RoleGuard)
  async createUser(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<CreateUserDTO> {
    const user = await this.userService.createUser(
      createUserDTO.id,
      createUserDTO.name,
      createUserDTO.lastname,
      createUserDTO.email,
      createUserDTO.password,
    );

    return user;
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findUsers(): Promise<User[]> {
    const users = await this.userService.findUsers();
    return users;
  }

  @Get('users/:param')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findUserByParam(@Param('param') param: string): Promise<User | object> {
    let user: User | null;

    if (!isNaN(Number(param))) {
      user = await this.userService.findUserByID(+param);
    } else {
      user = await this.userService.findUserByEmail(param);
    }

    if (!user) {
      return {
        message: 'User not found',
      };
    }

    return user;
  }

  @Put('users/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() body: { email: string; password: string },
  ): Promise<object> {
    const { email, password } = body;

    const user = await this.userService.updateUser(+id, email, password);
    console.log('user', user);

    return user;
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteUser(@Param('id') id: string): Promise<object> {
    const user = await this.userService.deleteUser(+id);

    if (!user) {
      return {
        message: 'User not found',
      };
    }

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
