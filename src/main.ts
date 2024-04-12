import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './lib/exception-filter';
import * as CookieParser from 'cookie-parser';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { SetResponseHeader } from './middlewares/set-response-header.middleware';
import { GlobalService } from './lib/globalservice';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule, { abortOnError: true });

  const config = new DocumentBuilder()
    .setTitle('tdd-practice')
    .setDescription('tdd practice')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  GlobalService.isDisableKeepAlive = false;

  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(CookieParser('dd'));
  app.use(SetResponseHeader);

  app.enableShutdownHooks();

  await app.listen(3000, () => {
    if (typeof process.send === 'function') {
      process.send('ready');
    }
    console.log('application is listening on port 3000');
  });
}
bootstrap();
