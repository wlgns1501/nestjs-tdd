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

    it('password hash 화 확인', async () => {
      const signUpDto: CreatedUserDto = {
        email: 'wlgns1501@gmail.com',
        name: 'jihun',
        password: '1234',
      };

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('HASHED_PASSWORD'));

      const hashPassword = await service.hashPassword(signUpDto.password);

      expect(hashPassword).toEqual('HASHED_PASSWORD');
    });

    it('user email 중복시 에러 반환', async () => {
      const duplicatedSignUpDto: CreatedUserDto = {
        email: 'wlgns1501@gmail.com',
        name: 'jihun',
        password: '1234',
      };

      jest
        .spyOn(service, 'hashPassword')
        .mockImplementation(() => Promise.resolve('HASHED_PASSWORD'));

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

      jest
        .spyOn(service, 'signUp')
        .mockRejectedValue(
          new HttpException(
            { message: '중복된 이메일 입니다.' },
            HttpStatus.BAD_REQUEST,
          ),
        );

      try {
        await userRepository.signUp(
          duplicatedSignUpDto.email,
          'HASHED_PASSWORD',
          duplicatedSignUpDto.name,
        );
      } catch (error) {
        expect(error.errno).toEqual(1062);
      }

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

    it('access 토큰 생성 확인', async () => {
      const signUpDto: CreatedUserDto = {
        email: 'wlgns1501@gmail.com',
        name: 'jihun',
        password: '1234',
      };

      jest
        .spyOn(jwt, 'sign')
        .mockImplementation(() => Promise.resolve('token'));

      const token = await service.signedToken(1);

      expect(token).toEqual('token');
    });

    it('access token 만들기 실패 할 경우 error 반환', async () => {
      const signUpDto: CreatedUserDto = {
        email: 'wlgns1501@gmail.com',
        name: 'jihun',
        password: '1234',
      };

      jest.spyOn(service, 'hashPassword').mockResolvedValue('HASHED_PASSWORD');
      jest.spyOn(userRepository, 'signUp').mockResolvedValue({
        id: 1,
        name: signUpDto.name,
        password: 'HASHED_PASSWORD',
        email: signUpDto.email,
        created_at: new Date(),
        updated_at: new Date(),
      } as User);

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

      jest.spyOn(service, 'hashPassword').mockResolvedValue('HASHED_PASSWORD');
      jest.spyOn(userRepository, 'signUp').mockResolvedValue({
        id: 1,
        name: signUpDto.name,
        password: 'HASHED_PASSWORD',
        email: signUpDto.email,
        created_at: new Date(),
        updated_at: new Date(),
      } as User);
      jest.spyOn(service, 'signedToken').mockResolvedValue('token');
      jest
        .spyOn(service, 'signUp')
        .mockResolvedValue({ userId: 1, accessToken: 'token' });

      const result = await service.signUp(signUpDto);
      await service.hashPassword(signUpDto.password);
      await service.signedToken(1);

      expect(result).toEqual({ userId: 1, accessToken: 'token' });
      expect(service.hashPassword).toHaveBeenCalledWith(signUpDto.password);
      expect(service.signedToken).toHaveBeenCalledWith(1);
    });
  });
});
