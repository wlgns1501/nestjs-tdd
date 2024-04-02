import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { CreatedUserDto } from './dtos/createdUser.dto';
import { DataSource, QueryFailedError } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { error } from 'console';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
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

    it('bcrypt hash 함수 실행 확인', async () => {
      const signUpDto = {
        email: 'wlgns1501@gmail.com',
        password: 'aaa',
        name: 'jihun',
      };

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('HASHED_PASSWORD'));

      const hashedPassword = await service.hashPassword(signUpDto.password);

      expect(hashedPassword).toEqual('HASHED_PASSWORD');
      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 9);
    });

    it('이메일 중복으로 회원 가입 실패', async () => {
      const duplicatedSignUpDto = {
        email: 'wlgns1501@gmail.com',
        password: 'aaa',
        name: 'jihun',
      };

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation((password: string, saltRound: number) =>
          Promise.resolve('HASHED_PASSWORD'),
        );
      jest.spyOn(service, 'hashPassword').mockResolvedValue('HASHED_PASSWORD');
      jest.spyOn(userRepository, 'signUp').mockRejectedValue(
        new QueryFailedError(
          'INSERT INTO `user`(`id`, `name`, `email`, `password`, `created_at`, `updated_at`) VALUES (DEFAULT, ?, ?, ?, DEFAULT, DEFAULT)',
          [
            duplicatedSignUpDto.name,
            duplicatedSignUpDto.email,
            'HASHED_PASSWORD',
          ],
          {
            code: 'ER_DUP_ENTRY',
            errno: 1062,
            sqlState: '23000',
            sqlMessage: `Duplicate entry '${duplicatedSignUpDto.email}' for key 'user.IDX_e12875dfb3b1d92d7d7c5377e2'`,
            sql: "INSERT INTO `user`(`id`, `name`, `email`, `password`, `created_at`, `updated_at`) VALUES (DEFAULT, 'jihun', 'wlgns1501@gmail.com', 'HASHED_PASSWORD', DEFAULT, DEFAULT)",
          },
        ),
      );

      await expect(
        userRepository.signUp(
          duplicatedSignUpDto.email,
          'HASHED_PASSWORD',
          duplicatedSignUpDto.name,
        ),
      ).rejects.toThrow(
        new QueryFailedError(
          'INSERT INTO `user`(`id`, `name`, `email`, `password`, `created_at`, `updated_at`) VALUES (DEFAULT, ?, ?, ?, DEFAULT, DEFAULT)',
          [
            duplicatedSignUpDto.name,
            duplicatedSignUpDto.email,
            'HASHED_PASSWORD',
          ],
          {
            code: 'ER_DUP_ENTRY',
            errno: 1062,
            sqlState: '23000',
            sqlMessage: `Duplicate entry '${duplicatedSignUpDto.email}' for key 'user.IDX_e12875dfb3b1d92d7d7c5377e2'`,
            sql: "INSERT INTO `user`(`id`, `name`, `email`, `password`, `created_at`, `updated_at`) VALUES (DEFAULT, 'jihun', 'wlgns1501@gmail.com', 'HASHED_PASSWORD', DEFAULT, DEFAULT)",
          },
        ),
      );

      await expect(service.signUp(duplicatedSignUpDto)).rejects.toThrow(
        new HttpException(
          { message: '중복된 이메일 입니다.' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('token sign 함수 실행 확인', async () => {
      const signUpDto = {
        email: 'wlgns1501@gmail.com',
        password: 'aaa',
        name: 'jihun',
      };

      const createdUser = {
        id: 1,
        email: 'wlgns1501@gmail.com',
        password: 'HASHED_PASSWORD',
        name: 'jihun',
      } as User;

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation((password: string, saltRound: number) =>
          Promise.resolve('HASHED_PASSWORD'),
        );
      jest.spyOn(service, 'hashPassword').mockResolvedValue('HASHED_PASSWORD');
      jest.spyOn(userRepository, 'signUp').mockResolvedValue(createdUser);
      jest
        .spyOn(jwt, 'sign')
        .mockImplementation(() => Promise.resolve('token'));

      const hashedPassword = await service.hashPassword(signUpDto.password);
      const user = await userRepository.signUp(
        signUpDto.email,
        hashedPassword,
        signUpDto.name,
      );

      const token = await service.signedToken(user.id);

      expect(token).toEqual('token');
      expect(jwt.sign).toHaveBeenCalledWith(
        String(user.id),
        process.env.JWT_SECRET,
      );
    });

    it('token sign화 실패 했을 때 에러 반환', async () => {
      const signUpDto = {
        email: 'wlgns1501@gmail.com',
        password: 'aaa',
        name: 'jihun',
      };

      const createdUser = {
        id: 1,
        email: 'wlgns1501@gmail.com',
        password: 'HASHED_PASSWORD',
        name: 'jihun',
      } as User;

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation((password: string, saltRound: number) =>
          Promise.resolve('HASHED_PASSWORD'),
        );
      jest.spyOn(service, 'hashPassword').mockResolvedValue('HASHED_PASSWORD');
      jest.spyOn(userRepository, 'signUp').mockResolvedValue(createdUser);
      jest
        .spyOn(jwt, 'sign')
        .mockImplementation(() => Promise.resolve('token'));
      jest
        .spyOn(service, 'signedToken')
        .mockRejectedValue(new jwt.JsonWebTokenError('error'));

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new HttpException(
          { message: 'token을 만드는데 실패 하였습니다.' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('회원 가입 성공시 userId와 token 반환', async () => {
      const signUpDto = {
        email: 'wlgns1501@gmail.com',
        password: 'aaa',
        name: 'jihun',
      };

      const createdUser = {
        id: 1,
        email: 'wlgns1501@gmail.com',
        password: 'HASHED_PASSWORD',
        name: 'jihun',
      } as User;

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation((password: string, saltRound: number) =>
          Promise.resolve('HASHED_PASSWORD'),
        );
      jest.spyOn(service, 'hashPassword').mockResolvedValue('HASHED_PASSWORD');
      jest.spyOn(userRepository, 'signUp').mockResolvedValue(createdUser);
      jest
        .spyOn(jwt, 'sign')
        .mockImplementation(() => Promise.resolve('token'));
      jest.spyOn(service, 'signedToken').mockResolvedValue('token');

      const result = await service.signUp(signUpDto);

      expect(result.userId).toEqual(1);
      expect(result.accessToken).toEqual('token');
      expect(service.hashPassword).toHaveBeenCalledTimes(1);
      expect(service.signedToken).toHaveBeenCalledTimes(1);
    });
  });
});
