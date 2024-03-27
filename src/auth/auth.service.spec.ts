import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { CreatedUserDto } from './dtos/createdUser.dto';

describe('AuthService', () => {
  let service: AuthService;
  let controller: AuthController;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserRepository],
      controllers: [AuthController],
    }).compile();

    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
    userRepository = module.get<UserRepository>(UserRepository);
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

      await expect(controller.signUp(notInEmailSignUpDto)).rejects.toThrow(
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

      await expect(controller.signUp(notEmailSignUpDto)).rejects.toThrow(
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

      await expect(controller.signUp(notInPasswordSignUpDto)).rejects.toThrow(
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

      await expect(controller.signUp(notInNameSignUpDto)).rejects.toThrow(
        new HttpException(
          { message: '이름을 입력하지 않았습니다.' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('회원가입에 성공 했을 경우 userId 반환', async () => {
      const signUpDto: CreatedUserDto = {
        email: 'wlgns1501@gmail.com',
        name: 'jihun',
        password: '1234',
      };

      jest.spyOn(service, 'signUp').mockResolvedValue({ success: true });

      const result = await controller.signUp(signUpDto);

      expect(result).toEqual({ success: true });
    });
  });
});
