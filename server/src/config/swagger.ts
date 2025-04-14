import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UserModule } from '../modules/user/user.module';

export function startSwagger(app: INestApplication) {
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .addBearerAuth()
      .addSecurityRequirements('bearer')
      .setTitle('API Documentation')
      .setDescription('Use this documentation to interact with the API')
      .setVersion('1')
      .build(),
    {
      // add Modules here
      include: [UserModule],
    },
  );

  SwaggerModule.setup('/api-docs', app, document, {
    customSiteTitle: 'API Documentation',
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });
}
