import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateBoardDto } from './createBoard.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CreateBoardPipe implements PipeTransform<CreateBoardDto> {
  async transform(value: CreateBoardDto, { metatype }: ArgumentMetadata) {
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
