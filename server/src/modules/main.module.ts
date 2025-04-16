import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfigService, validateEnv } from 'src/config/env.validation';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './user/guards/auth.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from 'src/cron-jobs/cron.service';
import { OrganizationModule } from './organization/organization.module';
import { CustomerModule } from './customer/customer.module';
import { SupplierModule } from './supplier/supplier.module';
import { ServiceModule } from './service/service.module';
import { ExpenseTypeModule } from './expense-type/expense-type.module';
import { ExpenseModule } from './expense/expense.module';

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

    // enable registering cron jobs
    ScheduleModule.forRoot(),

    // APIs
    UserModule,
    OrganizationModule,
    CustomerModule,
    SupplierModule,
    ServiceModule,
    ExpenseTypeModule,
    ExpenseModule,
  ],
  controllers: [],
  providers: [
    // provide guard to the whole app -> will protect all routes
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },

    // register cron jobs
    CronService,
  ],
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
