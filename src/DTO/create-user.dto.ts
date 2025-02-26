import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
