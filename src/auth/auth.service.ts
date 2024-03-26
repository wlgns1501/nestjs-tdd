import { Injectable } from '@nestjs/common';
import { CreatedUserDto } from './dtos/createdUser.dto';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(createdUserDto: CreatedUserDto) {
    return { success: true };
  }
}
