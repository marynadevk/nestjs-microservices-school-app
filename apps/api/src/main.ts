import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { envConfig } from './configs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  await app.listen(envConfig.port);
  Logger.log(
    `🚀 API is running on: http://localhost:${envConfig.port}/${globalPrefix}`
  );
}

bootstrap();
