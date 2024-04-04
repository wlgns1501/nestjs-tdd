import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BoardService } from './board.service';

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private service: BoardService) {}

  @Get('')
  @ApiOperation({ summary: '게시물 리스트' })
  @HttpCode(HttpStatus.OK)
  async getBoards() {
    return await this.service.getBoards();
  }

  @Get(':boardId')
  @ApiOperation({ summary: '게시물 상세페이지' })
  @HttpCode(HttpStatus.OK)
  async getBoard(@Param('boardId') boardId: number) {
    return await this.service.getBoard(boardId);
  }
}
