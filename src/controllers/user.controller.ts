import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from 'src/DTO/create-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    const user = await this.userService.createUser(
      createUserDTO.id,
      createUserDTO.name,
      createUserDTO.lastname,
      createUserDTO.email,
      createUserDTO.password,
    );

    return user;
  }

  @Get('users/:email')
  async findUserByEmail(@Param('email') email: string) {
    const user = await this.userService.findUserByEmail(email);
    return user;
  }

  @Get('users/:id')
  async findUserByID(@Param('id') id: string) {
    console.log(id);

    const user = await this.userService.findUserByID(+id);
    return user;
  }

  @Get('users')
  async findUsers() {
    const users = await this.userService.findUsers();
    return users;
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, email: string, password: string) {
    const user = await this.userService.updateUser(+id, email, password);
    return user;
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
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
  async deleteAllUsers() {
    const users = await this.userService.deleteAllUsers();
    return users;
  }
}
