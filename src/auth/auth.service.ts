import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatedUserDto } from './dtos/createdUser.dto';
import { UserRepository } from 'src/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 9);
  }

  async signedToken(userId: number) {
    return jwt.sign(String(userId), process.env.JWT_SECRET, {
      expiresIn: '9h',
    });
  }

  async signUp(createdUserDto: CreatedUserDto) {
    const { email, password, name } = createdUserDto;
    let accessToken;
    let userId;
    const hashedPassword = await this.hashPassword(password);
    try {
      userId = await this.userRepository.signUp(email, hashedPassword, name);
    } catch (err) {
      console.log(err);
    }

    try {
      accessToken = await this.signedToken(userId);
    } catch (error) {
      throw new HttpException(
        { message: 'token을 만드는데 실패 하였습니다.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return { userId, accessToken };
  }
}
