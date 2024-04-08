import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { UserRepository } from 'src/repositories/user.repository';
import { BoardRepository } from 'src/repositories/board.repository';
import { DataSource } from 'typeorm';
import { Board } from 'src/entities/board.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { CanActivate } from '@nestjs/common';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('BoardController', () => {
  let controller: BoardController;
  let service: BoardService;
  let userRepository: UserRepository;
  let boardRepository: BoardRepository;
  let mockGuard: CanActivate;
  const dataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    mockGuard = { canActivate: jest.fn() };
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
    })
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<BoardController>(BoardController);
    service = module.get<BoardService>(BoardService);
    userRepository = module.get<UserRepository>(UserRepository);
    boardRepository = module.get<BoardRepository>(BoardRepository);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(boardRepository).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(controller).toBeDefined();
    expect(mockGuard).toBeDefined();
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

  describe('게시물 생성 /board', () => {
    it('게시물 생성 성공시 게시물 반환', async () => {
      const createdBoardDto = {
        id: 1,
        title: 'first board',
        content: 'first board',
      } as Board;
      const userId = 1;

      jest
        .spyOn(AuthGuard.prototype, 'canActivate')
        .mockImplementation(() => Promise.resolve(true));
      jest.spyOn(service, 'createBoard').mockResolvedValue({ boardId: 1 });

      const result = await controller.createBoard(createdBoardDto, userId);

      expect(result).toEqual({ boardId: 1 });
    });
  });

  describe('게시물 수정 /board', () => {
    it('게시물 수정 성공시 게시물 반환', async () => {
      const updateBoardDto = {
        title: 'update Title',
        content: 'update Content',
      };

      const updatedBoardDto = {
        id: 1,
        title: 'update Title',
        content: 'update Content',
        user: {
          id: 1,
          name: 'jihun',
          email: 'wlgns1501@gmail.com',
        },
      } as Board;
      let req: any;
      const boardId = 1;
      const userId = 1;

      jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
      jest.spyOn(service, 'updateBoard').mockResolvedValue(updatedBoardDto);

      const result = await controller.updateBoard(
        updateBoardDto,
        userId,
        boardId,
      );

      expect(result.id).toBe(1);
      expect(result.title).toBe(updatedBoardDto.title);
      expect(result.content).toBe(updatedBoardDto.content);
    });
  });

  describe('게시물 삭제', () => {
    it('게시물 삭제 성공 시 메세지 반환', async () => {
      const deleteBoardId = 1;
      const userId = 1;

      jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
      jest.spyOn(service, 'deleteBoard').mockResolvedValue({ success: true });

      const result = await controller.deleteBoard(userId, deleteBoardId);

      expect(result).toStrictEqual({ success: true });
    });
  });
});
