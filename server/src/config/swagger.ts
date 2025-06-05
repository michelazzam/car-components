import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UserModule } from '../modules/user/user.module';
import { OrganizationModule } from 'src/modules/organization/organization.module';
import { CustomerModule } from 'src/modules/customer/customer.module';
import { SupplierModule } from 'src/modules/supplier/supplier.module';
import { ServiceModule } from 'src/modules/service/service.module';
import { ExpenseTypeModule } from 'src/modules/expense-type/expense-type.module';
import { ExpenseModule } from 'src/modules/expense/expense.module';
import { ItemModule } from 'src/modules/item/item.module';
import { PurchaseModule } from 'src/modules/purchase/purchase.module';
import { InvoiceModule } from 'src/modules/invoice/invoice.module';
import { AccountingModule } from 'src/modules/accounting/accounting.module';
import { ReportModule } from 'src/modules/report/report.module';
import { BackupModule } from 'src/modules/backup/backup.module';
import { CaisseModule } from 'src/modules/caisse/caisse.module';
import { VehicleMakesModule } from 'src/modules/vehicle-makes/vehicle-makes.module';
import { AppTokenModule } from 'src/modules/app-token/app-token.module';
import { PaymentMethodsModule } from 'src/modules/payment-methods/payment-methods.module';
import { TransactionsModule } from 'src/modules/transactions/transactions.module';

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
      include: [
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
        BackupModule,
        CaisseModule,
        VehicleMakesModule,
        AppTokenModule,
        PaymentMethodsModule,
        TransactionsModule,
      ],
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
