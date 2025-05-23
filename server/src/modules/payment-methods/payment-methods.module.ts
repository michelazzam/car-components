import { Module } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentMethod, PaymentMethodSchema } from './payment-method.schema';

@Module({
  imports: [
    // configure model to be used in this Module
    MongooseModule.forFeature([
      { name: PaymentMethod.name, schema: PaymentMethodSchema },
    ]),
  ],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
