import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './lib/exception-filter';
import * as CookieParser from 'cookie-parser';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule, { abortOnError: true });

  const config = new DocumentBuilder()
    .setTitle('tdd-practice')
    .setDescription('tdd practice')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(CookieParser('dd'));
  await app.listen(3000);
}
bootstrap();
