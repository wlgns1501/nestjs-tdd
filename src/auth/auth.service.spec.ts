import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { CreatedUserDto } from './dtos/createdUser.dto';
import { DataSource } from 'typeorm';
import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmConfigService } from 'ormconfig';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
  addTransactionalDataSource: jest.fn(),
  initializeTransactionalContext: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let controller: AuthController;
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

    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('회원가입', () => {
    it('이메일이 공백일 경우', async () => {
      const notInEmailSignUpDto = {
        email: '',
        name: 'jihun',
        password: '1234',
      };

      jest
        .spyOn(service, 'signUp')
        .mockRejectedValue(
          new HttpException(
            { message: '이메일을 입력하지 않았습니다.' },
            HttpStatus.BAD_REQUEST,
          ),
        );

      await expect(service.signUp(notInEmailSignUpDto)).rejects.toThrow(
        new HttpException(
          { message: '이메일을 입력하지 않았습니다.' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('이메일이 이메일 형식이 아닐 경우', async () => {
      const notEmailSignUpDto = {
        email: 'wlgns1501',
        name: 'jihun',
        password: '1234',
      };

      jest
        .spyOn(service, 'signUp')
        .mockRejectedValue(
          new HttpException(
            { message: '해당 이메일은 이메일 형식이 아닙니다.' },
            HttpStatus.BAD_REQUEST,
          ),
        );

      await expect(service.signUp(notEmailSignUpDto)).rejects.toThrow(
        new HttpException(
          { message: '해당 이메일은 이메일 형식이 아닙니다.' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('비밀번호가 공백인 경우', async () => {
      const notInPasswordSignUpDto = {
        email: 'wlgns1501@gmail.com',
        name: 'jihun',
        password: '',
      };

      jest
        .spyOn(service, 'signUp')
        .mockRejectedValue(
          new HttpException(
            { message: '비밀번호를 입력하지 않았습니다.' },
            HttpStatus.BAD_REQUEST,
          ),
        );

      await expect(service.signUp(notInPasswordSignUpDto)).rejects.toThrow(
        new HttpException(
          { message: '비밀번호를 입력하지 않았습니다.' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('이름이 공백일 때', async () => {
      const notInNameSignUpDto = {
        email: 'wlgns1501@gmail.com',
        name: '',
        password: '1234',
      };

      jest
        .spyOn(service, 'signUp')
        .mockRejectedValue(
          new HttpException(
            { message: '이름을 입력하지 않았습니다.' },
            HttpStatus.BAD_REQUEST,
          ),
        );

      await expect(service.signUp(notInNameSignUpDto)).rejects.toThrow(
        new HttpException(
          { message: '이름을 입력하지 않았습니다.' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('중복된 이메일인 경우 HttpException 반환', async () => {
      const signUpDto: CreatedUserDto = {
        email: 'wlgns1501@gmail.com',
        name: 'jihun',
        password: '1234',
      };

      jest
        .spyOn(service, 'signUp')
        .mockRejectedValue(
          new HttpException(
            { message: '중복된 이메일 입니다.' },
            HttpStatus.BAD_REQUEST,
          ),
        );

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new HttpException(
          { message: '중복된 이메일 입니다.' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('access 토큰 생성 확인', async () => {
      const signUpDto: CreatedUserDto = {
        email: 'wlgns1501@gmail.com',
        name: 'jihun',
        password: '1234',
      };

      jest
        .spyOn(service, 'signedToken')
        .mockImplementation(() => Promise.resolve('token'));

      jest
        .spyOn(service, 'signUp')
        .mockResolvedValue({ userId: 1, accessToken: 'token' });

      const result = await service.signUp(signUpDto);

      expect(result.accessToken).toEqual('token');
      // expect(service.signedToken).toHaveBeenCalled();
    });

    it('access token 만들기 실패 할 경우 error 반환', async () => {
      const signUpDto: CreatedUserDto = {
        email: 'wlgns1501@gmail.com',
        name: 'jihun',
        password: '1234',
      };

      jest
        .spyOn(service, 'signedToken')
        .mockImplementation(() => Promise.reject('error'));

      jest
        .spyOn(service, 'signUp')
        .mockRejectedValue(
          new HttpException(
            { message: 'token을 만드는데 실패 하였습니다.' },
            HttpStatus.BAD_REQUEST,
          ),
        );

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new HttpException(
          { message: 'token을 만드는데 실패 하였습니다.' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('회원가입에 성공 했을 경우 userId와 accessToken 반환', async () => {
      const signUpDto: CreatedUserDto = {
        email: 'wlgns1501@gmail.com',
        name: 'jihun',
        password: '1234',
      };

      jest.spyOn(service, 'signedToken').mockResolvedValue('token');
      jest
        .spyOn(service, 'signUp')
        .mockResolvedValue({ userId: 1, accessToken: 'token' });

      const result = await service.signUp(signUpDto);

      expect(result).toEqual({ userId: 1, accessToken: 'token' });
    });
  });
});
