import { Test, TestingModule } from '@nestjs/testing';
import { ACCESS_TOKEN_EXPIREDSIN, AuthController } from './auth.controller';
import { CreatedUserDto } from './dtos/createdUser.dto';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/repositories/user.repository';
import { DataSource } from 'typeorm';
import { Response } from 'express';
import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userRepository: UserRepository;

  const dataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);

    jest.clearAllMocks();
  });

  describe('회원 가입 : auth/signUp', () => {
    it('회원 가입 성공 시 cookie에 토큰 반환', async () => {
      const signUpDto: CreatedUserDto = {
        email: 'wlgns1501@gmail.com',
        name: 'jihun',
        password: '1234',
      };

      jest
        .spyOn(service, 'signUp')
        .mockImplementation(() => Promise.resolve({ userId: 1 }));

      const result = await controller.signUp(signUpDto);

      expect(result).toStrictEqual({ userId: 1 });
    });
  });

  describe('로그인 : auth/signIn ', () => {
    it('로그인 성공 시 cookie에 accessToken 반환', async () => {
      await controller.signIn(logInDto);
    });
  });
});
