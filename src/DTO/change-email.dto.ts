import { IsEmail } from 'class-validator';

export class ChangeEmailDTO {
  @IsEmail()
  email: string;
}
