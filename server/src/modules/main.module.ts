import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfigService, validateEnv } from 'src/config/env.validation';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './user/guards/auth.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { OrganizationModule } from './organization/organization.module';
import { CustomerModule } from './customer/customer.module';
import { SupplierModule } from './supplier/supplier.module';
import { ServiceModule } from './service/service.module';
import { ExpenseTypeModule } from './expense-type/expense-type.module';
import { ExpenseModule } from './expense/expense.module';
import { ItemModule } from './item/item.module';
import { PurchaseModule } from './purchase/purchase.module';
import { InvoiceModule } from './invoice/invoice.module';
import { AccountingModule } from './accounting/accounting.module';
import { ReportModule } from './report/report.module';
import { CaisseModule } from './caisse/caisse.module';
import { BackupModule } from './backup/backup.module';
import { VehicleMakesModule } from './vehicle-makes/vehicle-makes.module';
import { AppTokenModule } from './app-token/app-token.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { TelegramService } from 'src/lib/telegram.service';
import { GlobalExceptionFilter } from 'src/middleware/global-exception-filter.middleware';
import { TransactionsModule } from './transactions/transactions.module';
import { LoansTransactionsModule } from './loans-transactions/loans-transactions.module';

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
    ItemModule,
    PurchaseModule,
    InvoiceModule,
    AccountingModule,
    ReportModule,
    CaisseModule,
    BackupModule,
    VehicleMakesModule,
    AppTokenModule,
    PaymentMethodsModule,
    TransactionsModule,
    LoansTransactionsModule,
  ],
  controllers: [],
  providers: [
    // provide guard to the whole app -> will protect all routes
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    EnvConfigService,
    GlobalExceptionFilter,
    TelegramService,
  ],
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
