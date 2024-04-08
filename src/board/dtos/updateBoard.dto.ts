import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateBoardDto {
  @ApiProperty({ description: 'title', required: true })
  @IsNotEmpty({ message: '제목을 입력하지 않았습니다.' })
  title: string;

  @ApiProperty({ description: 'content', required: true })
  @IsNotEmpty({ message: '본문을 입력하지 않았습니다.' })
  content: string;
}
