import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreatedUserPipe } from './dtos/createdUser.pipe';
import { CreatedUserDto } from './dtos/createdUser.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('signUp')
  @ApiOperation({ summary: 'signUp' })
  async signUp(@Body(new CreatedUserPipe()) createdUserDto: CreatedUserDto) {
    return this.service.signUp(createdUserDto);
  }
}
