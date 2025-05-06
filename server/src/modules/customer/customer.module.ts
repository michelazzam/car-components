import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Customer,
  CustomerSchema,
  Vehicle,
  VehicleSchema,
} from './customer.schema';
import { Invoice, InvoiceSchema } from '../invoice/invoice.schema';

@Module({
  imports: [
    // configure model to be used in this Module
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: Vehicle.name, schema: VehicleSchema },
      {
        name: Invoice.name,
        schema: InvoiceSchema,
      },
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
