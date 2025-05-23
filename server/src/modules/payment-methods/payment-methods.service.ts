import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { Model } from 'mongoose';
import { IPaymentMethod, PaymentMethod } from './payment-method.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectModel(PaymentMethod.name)
    private paymentMethodModel: Model<IPaymentMethod>,
  ) {}

  create(createPaymentMethodDto: CreatePaymentMethodDto) {
    return this.paymentMethodModel.create(createPaymentMethodDto);
  }

  findAll() {
    return this.paymentMethodModel.find().lean();
  }

  async update(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    const paymentMethod = await this.paymentMethodModel.findById(id);
    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    await this.paymentMethodModel.findByIdAndUpdate(id, updatePaymentMethodDto);
  }

  async delete(id: string) {
    const paymentMethod = await this.paymentMethodModel.findById(id);
    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    await this.paymentMethodModel.findByIdAndDelete(id);
  }
}
