import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from 'src/board/dtos/createBoard.dto';
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

  async getBoardById(boardId: number) {
    return await this.createQueryBuilder('b')
      .select([
        'b.id as id',
        'b.title as title',
        'b.content as content',
        `json_object('id' , u.id, 'name', u.name, 'email', u.email) as user`,
      ])
      .leftJoin('user', 'u', `b.userId = u.id`)
      .where(`b.id = ${boardId}`)
      .getRawOne();
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    userId: number,
  ): Promise<Board> {
    const { title, content } = createBoardDto;

    return await this.create({ title, content, userId }).save();
  }
}
