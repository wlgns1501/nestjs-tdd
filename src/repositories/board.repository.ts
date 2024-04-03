import { Injectable } from '@nestjs/common';
import { Board } from 'src/entities/board.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class BoardRepository extends Repository<Board> {
  constructor(private readonly dataSource: DataSource) {
    super(Board, dataSource.createEntityManager());
  }

  async getBoards() {
    return await this.find();
  }
}
