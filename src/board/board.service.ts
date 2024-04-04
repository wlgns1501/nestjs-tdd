import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BoardRepository } from 'src/repositories/board.repository';
import { UserRepository } from 'src/repositories/user.repository';

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
}
