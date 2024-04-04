import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { BoardRepository } from 'src/repositories/board.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { DataSource } from 'typeorm';
import { Board } from 'src/entities/board.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

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

    it('게시물 존재할 때 리스트 반환', async () => {
      const getBoards = [
        {
          id: 1,
          title: 'first',
          content: 'first content',
          user: {
            id: 1,
            name: 'jihun',
            email: 'wlgns1501@gmail.com',
          },
        } as Board,
        {
          id: 2,
          title: 'second',
          content: 'second content',
          user: {
            id: 1,
            name: 'jihun',
            email: 'wlgns1501@gmail.com',
          },
        } as Board,
      ];

      jest.spyOn(boardRepository, 'getBoards').mockResolvedValue(getBoards);

      const result = await service.getBoards();

      expect(result).toStrictEqual({ boards: getBoards });
    });
  });

  describe('게시물 상세 조회', () => {
    it('게시물이 존재하지 않을때 에러 반환', async () => {
      const params = 999;

      jest.spyOn(boardRepository, 'getBoardById').mockResolvedValue(undefined);

      await expect(service.getBoard(params)).rejects.toThrow(
        new HttpException(
          { message: '해당 게시물은 존재하지 않습니다.' },
          HttpStatus.NOT_FOUND,
        ),
      );

      expect(boardRepository.getBoardById).toHaveBeenCalledWith(params);
    });

    it('게시물이 존재 할 때 게시물 반환', async () => {
      const params = 1;
      const getBoard = {
        id: 1,
        title: 'first',
        content: 'first content',
        user: {
          id: 1,
          name: 'jihun',
          email: 'wlgns1501@gmail.com',
        },
        created_at: new Date(),
      } as Board;

      jest.spyOn(boardRepository, 'getBoardById').mockResolvedValue(getBoard);

      const result = await service.getBoard(params);

      expect(result).toStrictEqual(getBoard);
      expect(boardRepository.getBoardById).toHaveBeenCalledWith(params);
    });
  });
});
