import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  resetToken: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
