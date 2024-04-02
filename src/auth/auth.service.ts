import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatedUserDto } from './dtos/createdUser.dto';
import { UserRepository } from 'src/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Transactional } from 'typeorm-transactional';
import { User } from 'src/entities/user.entity';
import { SignInDto } from './dtos/signIn.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 9);
  }

  async signedToken(userId: number): Promise<string> {
    return jwt.sign(String(userId), process.env.JWT_SECRET);
  }

  @Transactional()
  async signUp(createdUserDto: CreatedUserDto): Promise<{ userId: number }> {
    const { email, password, name } = createdUserDto;
    let user: User | any;
    const hashedPassword = await this.hashPassword(password);

    try {
      user = await this.userRepository.signUp(email, hashedPassword, name);
    } catch (error) {
      if (error.errno === 1062) {
        throw new HttpException(
          { message: '중복된 이메일 입니다.' },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return { userId: user.id };
  }
}
