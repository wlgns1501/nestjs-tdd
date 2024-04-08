import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BoardService } from './board.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateBoardPipe } from './dtos/createBoard.pipe';
import { CreateBoardDto } from './dtos/createBoard.dto';
import { UpdateBoardDto } from './dtos/updateBoard.dto';
import { UpdateBoardPipe } from './dtos/updateBoard.pipe';

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

  @Get(':boardId')
  @ApiOperation({ summary: '게시물 상세페이지' })
  @HttpCode(HttpStatus.OK)
  async getBoard(@Param('boardId') boardId: number) {
    return await this.service.getBoard(boardId);
  }

  @Patch(':boardId')
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

  @Delete(':boardId')
  @ApiOperation({ summary: '게시물 삭제' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async deleteBoard(@Param('boardId') boardId: number, @Req() req: any) {
    return this.service.deleteBoard(req.userId, boardId);
  }
}
