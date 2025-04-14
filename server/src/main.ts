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

  startSwagger(app);

  // access environment variables
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 8000);

  // start server
  await app.listen(port);
}
bootstrap();
