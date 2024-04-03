import { Injectable } from '@nestjs/common';
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
}
