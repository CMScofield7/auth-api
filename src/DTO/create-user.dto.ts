<<<<<<< HEAD
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;

=======
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
>>>>>>> 0.13
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
<<<<<<< HEAD
=======

  @IsString()
  @IsNotEmpty()
  role: string = 'user';
>>>>>>> 0.13
}
