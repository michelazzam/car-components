import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfigService, validateEnv } from 'src/config/env.validation';

@Module({
  imports: [
    // configure config globally for easy access to environment variables
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),

    // configure mongoose globally
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: EnvConfigService) => ({
        uri: configService.get('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),

    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
