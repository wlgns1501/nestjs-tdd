import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from 'ormconfig';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import {
  addTransactionalDataSource,
  getDataSourceByName,
} from 'typeorm-transactional';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (
        options?: DataSourceOptions,
      ): Promise<DataSource> => {
        if (!options) throw new Error('options is undefined');
        return addTransactionalDataSource({
          dataSource: new DataSource(options),
        });
      },
    }),

    // useClass: TypeOrmConfigService,
    // dataSourceFactory: async (options): Promise<DataSource> => {
    //   if (!options) {
    //     throw new Error('Invalid options passed');
    //   }

    //   return addTransactionalDataSource({
    //     dataSource: new DataSource(options),
    //   }).initialize();
    // },

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
