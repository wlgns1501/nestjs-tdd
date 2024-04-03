import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { BoardRepository } from 'src/repositories/board.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  controllers: [BoardController],
  providers: [BoardService, BoardRepository, UserRepository],
})
export class BoardModule {}
