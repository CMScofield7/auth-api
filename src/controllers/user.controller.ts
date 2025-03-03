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
<<<<<<< HEAD
=======
import { ChangeEmailDTO } from 'src/DTO/change-email.dto';
import { ChangePasswordDTO } from 'src/DTO/change-password.dto';
import { ForgotPasswordDTO } from 'src/DTO/forgot-password.dto';
import { ResetPasswordDTO } from 'src/DTO/reset-password.dto';
>>>>>>> 0.13

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UseGuards(RoleGuard)
<<<<<<< HEAD
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<string> {
    return await this.userService.createUser(
      createUserDTO.id,
      createUserDTO.name,
      createUserDTO.lastname,
      createUserDTO.email,
      createUserDTO.password,
    );
  }

=======
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

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDTO) {
    const { email } = body;
    return await this.userService.forgotPassword(email);
  }

>>>>>>> 0.13
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
<<<<<<< HEAD
    };
  }

  @Get('users/:param')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findUserByParam(@Param('param') param: string): Promise<User | null> {
    if (!isNaN(Number(param))) {
      return await this.userService.findUserByID(+param);
    } else {
      return await this.userService.findUserByEmail(param);
    }
  }

  @Put('users/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() body: { email: string; password: string },
  ): Promise<object> {
    const { email, password } = body;

    return await this.userService.updateUser(+id, email, password);
=======
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

  @Put('users/me/change-email')
  @UseGuards(JwtAuthGuard)
  async changeEmail(@Body() body: ChangeEmailDTO): Promise<object> {
    const { email } = body;

    return await this.userService.changeEmail(email);
  }

  @Put('users/me/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() body: ChangePasswordDTO,
    @Request() req: { user: Payload },
  ): Promise<object> {
    const { oldPassword, newPassword } = body;
    return await this.userService.changePassword(
      +req.user.id,
      oldPassword,
      newPassword,
    );
  }

  @Put('reset-password')
  async resetPassword(@Body() body: ResetPasswordDTO) {
    const { resetToken, newPassword } = body;
    return await this.userService.resetPassword(resetToken, newPassword);
>>>>>>> 0.13
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteUser(@Param('id') id: string): Promise<object> {
<<<<<<< HEAD
    const user = await this.userService.deleteUser(+id);

    if (!user) {
      return {
        message: 'User not found',
      };
    }
=======
    await this.userService.deleteUser(+id);
>>>>>>> 0.13

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
