import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from 'src/repositories/user.repository';

export type JwtPayload = {
  userId: number;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const accessToken = request.cookies['accessToken'];

    if (!accessToken) {
      throw new HttpException(
        { message: '토큰이 존재하지 않습니다.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const verifiedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
      const { userId } = verifiedToken as jwt.JwtPayload;

      const user = await this.userRepository.getUserById(userId);

      if (!user) {
        throw new HttpException(
          { message: '해당 유저는 존재하지 않습니다.' },
          HttpStatus.NOT_FOUND,
        );
      }

      request['userId'] = user.id;

      return true;
    } catch (error) {
      if (error.hasOwnProperty('expiredAt'))
        throw new HttpException(
          {
            message: '토큰이 만료 되었습니다.',
          },
          HttpStatus.UNAUTHORIZED,
        );

      return false;
    }
  }
}
