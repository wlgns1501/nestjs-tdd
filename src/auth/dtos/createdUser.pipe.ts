import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatedUserDto } from './createdUser.dto';

@Injectable()
export class CreatedUserPipe implements PipeTransform<CreatedUserDto> {
  async transform(value: CreatedUserDto, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);

    const errors = await validate(object);

    if (errors.length > 0) {
      const { constraints } = errors[0];

      throw new HttpException(
        { message: Object.values(constraints)[0] },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Number, Boolean, Array, Object];
    return !types.includes(metatype);
  }
}
