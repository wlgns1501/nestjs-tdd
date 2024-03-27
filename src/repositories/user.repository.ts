import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async signUp(email: string, password: string, name: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new User();
      user.name = name;
      user.password = password;
      user.email = email;

      await queryRunner.manager.save(user);
      return user.id;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error.errno === 1062) {
        throw new HttpException(
          { message: '중복된 이메일 입니다.' },
          HttpStatus.BAD_REQUEST,
        );
      }
    } finally {
      await queryRunner.release();
    }
  }
}
