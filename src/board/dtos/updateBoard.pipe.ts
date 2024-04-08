import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UpdateBoardDto } from './updateBoard.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UpdateBoardPipe implements PipeTransform<UpdateBoardDto> {
  async transform(value: UpdateBoardDto, { metatype }: ArgumentMetadata) {
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
