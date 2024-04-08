import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BoardService } from './board.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateBoardPipe } from './dtos/createBoard.pipe';
import { CreateBoardDto } from './dtos/createBoard.dto';

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

  @Post('')
  @ApiOperation({ summary: '게시물 생성' })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async createBoard(
    @Body(new CreateBoardPipe()) createBoardDto: CreateBoardDto,
    @Req() req: any,
  ) {
    return await this.service.createBoard(createBoardDto, req.userId);
  }

  @Put(':boardId')
  @ApiOperation({ summary: '게시물 수정' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async updateBoard(
    @Body(new UpdateBoardPipe()) updateBoardDto: UpdateBoardDto,
    @Req() req: any,
    @Param('boardId') boardId: number,
  ) {
    return this.service.updateBoard(updateBoardDto, req.userId, boardId);
  }
}
