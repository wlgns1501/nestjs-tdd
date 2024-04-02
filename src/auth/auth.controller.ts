import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreatedUserPipe } from './dtos/createdUser.pipe';
import { CreatedUserDto } from './dtos/createdUser.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Request, Response } from 'express';
import { SignInPipe } from './dtos/signIn.pipe';
import { SignInDto } from './dtos/signIn.dto';

export const ACCESS_TOKEN_EXPIREDSIN = 1000 * 60 * 60 * 24;
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('signUp')
  @ApiOperation({ summary: 'signUp' })
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body(new CreatedUserPipe()) createdUserDto: CreatedUserDto,
  ): Promise<{ userId: number } | void> {
    return await this.service.signUp(createdUserDto);
  }
}
