import { IsString, IsEmpty, IsEmail } from 'class-validator';

export class CreatedUserDto {
  @IsEmail()
  @IsEmpty()
  email: string;

  @IsString()
  @IsEmpty()
  name: string;

  @IsString()
  @IsEmpty()
  password: string;
}
