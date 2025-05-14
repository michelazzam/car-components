import { NestFactory } from '@nestjs/core';
import { MainModule } from './modules/main.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { startSwagger } from './config/swagger';
import { ConfigService } from '@nestjs/config';
import * as nodeCrypto from 'crypto';
if (typeof (globalThis as any).crypto === 'undefined') {
  (globalThis as any).crypto = {
    randomUUID: (): string => nodeCrypto.randomUUID(),
  };
}

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  app.enableCors({
    origin: ['http://tauri.localhost', '*'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
  });

  // global pipe to transform field types into their needed types
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.enableVersioning({
    type: VersioningType.URI,
  });

  // access environment variables
  const configService = app.get(ConfigService);

  // start swagger in dev mode
  const isDev = configService.get('NODE_ENV') === 'development';
  isDev && startSwagger(app);

  // start server
  const port = configService.get('PORT', 8000);
  await app.listen(port);
}
bootstrap();
