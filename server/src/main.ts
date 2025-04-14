import { NestFactory } from '@nestjs/core';
import { MainModule } from './modules/main.module';
import { ValidationPipe } from '@nestjs/common';
import { startSwagger } from './config/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // global pipe to transform field types into their needed types
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

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
