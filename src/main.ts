import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Dto validation for post API requests
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: 'http://localhost:8080' });
  app.useBodyParser('json', { limit: '10mb' });
  await app.listen(3000);
}

bootstrap();
