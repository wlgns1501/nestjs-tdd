import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmpty, IsEmail } from 'class-validator';

export class CreatedUserDto {
  @IsEmail()
  @IsEmpty()
  @ApiProperty({ description: 'email', required: true })
  email: string;

  @IsString()
  @IsEmpty()
  @ApiProperty({ description: 'name', required: true })
  name: string;

  @IsString()
  @IsEmpty()
  @ApiProperty({ description: 'password', required: true })
  password: string;
}
