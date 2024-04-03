import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BoardService } from './board.service';

@ApiTags('board')
@Controller('board')
export class BoardController {
  constructor(private service: BoardService) {}

  @Get('')
  @ApiOperation({ summary: 'boards list' })
  @HttpCode(HttpStatus.OK)
  async getBoards() {
    return await this.service.getBoards();
  }
}
