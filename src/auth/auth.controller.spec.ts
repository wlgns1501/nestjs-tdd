import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { CreatedUserDto } from './dtos/createdUser.dto';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/repositories/user.repository';
import { DataSource } from 'typeorm';
import { response } from 'express';
import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userRepository: UserRepository;

  const dataSource = {
    createEntityManager: jest.fn(),
  };

  jest.mock('typeorm-transactional', () => ({
    Transactional: () => () => ({}),
  }));

  beforeEach(async () => {
    initializeTransactionalContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserRepository],
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
        .mockResolvedValue({ userId: 1, accessToken: 'token' });

      const result = await controller.signUp(signUpDto, response);

      expect(result).toStrictEqual({ userId: 1 });
      expect(service.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });
});
