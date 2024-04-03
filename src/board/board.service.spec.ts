import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { BoardRepository } from 'src/repositories/board.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { DataSource } from 'typeorm';

describe('BoardService', () => {
  let service: BoardService;
  let userRepository: UserRepository;
  let boardRepository: BoardRepository;
  const dataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        BoardRepository,
        UserRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
    userRepository = module.get<UserRepository>(UserRepository);
    boardRepository = module.get<BoardRepository>(BoardRepository);
  });

  describe('게시물 전체 조회', () => {
    it('게시물이 없을 때 빈 리스트 반환', async () => {
      jest.spyOn(boardRepository, 'getBoards').mockResolvedValue([]);

      const result = await service.getBoards();

      expect(result).toStrictEqual({ boards: [] });
    });
  });
});
