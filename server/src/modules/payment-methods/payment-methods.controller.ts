import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payment Methods')
@Controller({ version: '1', path: 'payment-methods' })
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  async create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    const paymentMethod = await this.paymentMethodsService.create(
      createPaymentMethodDto,
    );

    return {
      message: 'Payment method saved successfully',
      data: { paymentMethod },
    };
  }

  @Get()
  findAll() {
    return this.paymentMethodsService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    await this.paymentMethodsService.update(id, updatePaymentMethodDto);

    return {
      message: 'Payment method updated successfully',
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.paymentMethodsService.delete(id);

    return {
      message: 'Payment method deleted successfully',
    };
  }
}
