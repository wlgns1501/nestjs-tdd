import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatedUserDto } from './createdUser.dto';

@Injectable()
export class CreatedUserPipe implements PipeTransform<any> {
  async transform(value: any, { metatype, data }: ArgumentMetadata) {
    const object = plainToInstance(metatype, value);

    const errors = await validate(object);

    console.log(errors);

    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}
