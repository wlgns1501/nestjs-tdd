import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { UserRepository } from 'src/repositories/user.repository';
import { BoardRepository } from 'src/repositories/board.repository';
import { DataSource } from 'typeorm';
import { Board } from 'src/entities/board.entity';

describe('BoardController', () => {
  let controller: BoardController;
  let service: BoardService;
  let userRepository: UserRepository;
  let boardRepository: BoardRepository;
  const dataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [
        BoardService,
        UserRepository,
        BoardRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    controller = module.get<BoardController>(BoardController);
    service = module.get<BoardService>(BoardService);
    userRepository = module.get<UserRepository>(UserRepository);
    boardRepository = module.get<BoardRepository>(BoardRepository);
  });

  describe('전체 게시물 조회 /boards', () => {
    it('boards 리스트 반환', async () => {
      jest.spyOn(service, 'getBoards').mockResolvedValue({ boards: [] });

      const result = await controller.getBoards();

      expect(result).toStrictEqual({ boards: [] });
    });
  });

  describe('상세페이지 조회 /boards/:id', () => {
    it('상세 페이지 조회', async () => {
      const getBoard = {
        id: 1,
        title: 'first board',
        content: 'first board',
        user: {
          id: 1,
          name: 'jihun',
          email: 'wlgns1501@gmail.com',
        },
      } as Board;

      jest.spyOn(service, 'getBoard').mockResolvedValue(getBoard);

      const board = await controller.getBoard(1);

      expect(board).toStrictEqual(getBoard);
    });
  });
});
