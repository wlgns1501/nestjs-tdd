import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BoardRepository } from 'src/repositories/board.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { Transactional } from 'typeorm-transactional';
import { CreateBoardDto } from './dtos/createBoard.dto';
import { Board } from 'src/entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    private boardRepository: BoardRepository,
    private userRepository: UserRepository,
  ) {}

  async getBoards() {
    const boards = await this.boardRepository.getBoards();

    return { boards };
  }

  async getBoard(boardId: number) {
    const board = await this.boardRepository.getBoardById(boardId);

    if (!board) {
      throw new HttpException(
        { message: '해당 게시물은 존재하지 않습니다.' },
        HttpStatus.NOT_FOUND,
      );
    }

    return board;
  }

  @Transactional()
  async createBoard(createBoardDto: CreateBoardDto, userId: number) {
    let createdBoard: Board | null;
    try {
      createdBoard = await this.boardRepository.createBoard(
        createBoardDto,
        userId,
      );
    } catch (err) {
      throw new HttpException(
        { message: '게시물을 생성하는데 오류가 발생했습니다.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return { boardId: createdBoard.id };
  }

  @Transactional()
  async updateBoard(
    updateBoardDto: UpdateBoardDto,
    userId: number,
    boardId: number,
  ) {
    return 'aa';
  }
}
