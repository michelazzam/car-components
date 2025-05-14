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
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005',
      'http://localhost:3006',
      'http://localhost:3007',
      'http://localhost:3008',
      //allow all origins
      '*',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
    credentials: true,
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
