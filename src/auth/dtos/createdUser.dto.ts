import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreatedUserDto {
  @IsEmail({}, { message: '해당 이메일은 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일을 입력하지 않았습니다.' })
  @ApiProperty({ description: 'email', required: true })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력하지 않았습니다.' })
  @ApiProperty({ description: 'name', required: true })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '이름을 입력하지 않았습니다.' })
  @ApiProperty({ description: 'password', required: true })
  password: string;
}
