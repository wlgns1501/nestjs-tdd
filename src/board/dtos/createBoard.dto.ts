import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty({ message: '제목을 입력하지 않았습니다.' })
  @ApiProperty({ description: 'title', required: true })
  title: string;

  @IsNotEmpty({ message: '본문을 입력하지 않았습니다.' })
  @ApiProperty({ description: 'content', required: true })
  content: string;
}
