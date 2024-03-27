import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatedUserDto } from './dtos/createdUser.dto';
import { UserRepository } from 'src/repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async hashedPassword(password) {
    return await bcrypt.hash(password, 9);
  }

  async signUp(createdUserDto: CreatedUserDto) {
    const { email, password, name } = createdUserDto;

    const hashedPassword = await this.hashedPassword(password);

    const user = await this.userRepository.signUp(email, hashedPassword, name);
  }
}
