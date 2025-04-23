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

@Module({
  imports: [
    // configure model to be used in this Module
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: Vehicle.name, schema: VehicleSchema },
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
