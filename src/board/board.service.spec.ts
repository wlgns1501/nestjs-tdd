import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { BoardRepository } from 'src/repositories/board.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { DataSource } from 'typeorm';
import { Board } from 'src/entities/board.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BoardController } from './board.controller';
import { CreateBoardDto } from './dtos/createBoard.dto';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('BoardService', () => {
  let service: BoardService;
  let controller: BoardController;
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
        {
          provide: DataSource,
          useValue: dataSource,
        },
        UserRepository,
      ],
      controllers: [BoardController],
    }).compile();

    service = module.get<BoardService>(BoardService);
    controller = module.get<BoardController>(BoardController);
    userRepository = module.get<UserRepository>(UserRepository);
    boardRepository = module.get<BoardRepository>(BoardRepository);
  });

  afterAll(() => {
    jest.restoreAllMocks();
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

  describe('게시물 생성', () => {
    it('게시물 title이 존재 하지 않을때 에러 반환', async () => {
      const notTitleBoardDto = {
        title: '',
        content: 'first board',
        userId: 1,
      };

      const userId = 1;

      jest
        .spyOn(service, 'createBoard')
        .mockRejectedValue(
          new HttpException(
            { message: '제목을 입력하지 않았습니다.' },
            HttpStatus.BAD_REQUEST,
          ),
        );

      await expect(
        service.createBoard(notTitleBoardDto, userId),
      ).rejects.toThrow(
        new HttpException(
          { message: '제목을 입력하지 않았습니다.' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('게시물 본문이 존재 하지 않을때 에러 반환', async () => {
      const notContentBoardDto = {
        title: 'first board',
        content: '',
        userId: 1,
      };

      const userId = 1;

      jest
        .spyOn(service, 'createBoard')
        .mockRejectedValue(
          new HttpException(
            { message: '본문을 입력하지 않았습니다.' },
            HttpStatus.BAD_REQUEST,
          ),
        );

      await expect(
        service.createBoard(notContentBoardDto, userId),
      ).rejects.toThrow(
        new HttpException(
          { message: '본문을 입력하지 않았습니다.' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('게시물 생성에 에러가 생길 경우 에러 반환', async () => {
      const createBoardDto = {
        title: 'first board',
        content: 'first board',
      } as CreateBoardDto;

      const createdBoardDto = {
        title: 'first board',
        content: 'first board',
        userId: 1,
      } as Board;

      const userId = 1;

      jest
        .spyOn(boardRepository, 'createBoard')
        .mockRejectedValue(new Error('error'));

      try {
        const result = await service.createBoard(createBoardDto, userId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        await expect(
          service.createBoard(createBoardDto, userId),
        ).rejects.toThrow(
          new HttpException(
            { message: '게시물을 생성하는데 오류가 발생했습니다.' },
            HttpStatus.BAD_REQUEST,
          ),
        );
      }
    });

    it('게시물 생성 후 게시물 id 반환', async () => {
      const createBoardDto = {
        title: 'first board',
        content: 'first board',
      } as CreateBoardDto;

      const createdBoardDto = {
        id: 1,
        title: 'first board',
        content: 'first board',
        userId: 1,
      } as Board;

      const userId = 1;

      jest
        .spyOn(boardRepository, 'createBoard')
        .mockResolvedValue(createdBoardDto);

      try {
        const result = await service.createBoard(createBoardDto, userId);

        expect(boardRepository.createBoard).toHaveBeenCalledWith({
          createBoardDto,
          userId,
        });
        expect(result.boardId).toEqual(1);
      } catch (err) {}
    });
  });
});
