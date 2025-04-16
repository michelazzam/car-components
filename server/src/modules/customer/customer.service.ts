import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, ICustomer } from './customer.schema';
import { FilterQuery, Model } from 'mongoose';
import { AddCustomerDto } from './dto/add-customer.dto';
import { EditCustomerDto } from './dto/edit-customer.dto';
import { GetCustomersDto } from './dto/get-customers.dto';
import { AddVehicleDto } from './dto/add-vehicle.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private customerModel: Model<ICustomer>,
  ) {}

  async getOne(id: string) {
    const customer = await this.customerModel.findById(id);
    if (!customer) throw new NotFoundException('Customer not found');

    return customer;
  }

  async getAll(dto: GetCustomersDto) {
    const { pageIndex, search, pageSize } = dto;

    const filter: FilterQuery<ICustomer> = {};

    // Add search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [customers, totalCount] = await Promise.all([
      this.customerModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(pageIndex * pageSize)
        .limit(pageSize),
      this.customerModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      customers,
      pagination: {
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  async create(customer: AddCustomerDto) {
    return await this.customerModel.create(customer);
  }

  async editCustomer(id: string, dto: EditCustomerDto) {
    const customer = await this.customerModel.findOneAndUpdate(
      { _id: id },
      dto,
    );

    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async deleteCustomer(id: string) {
    const customer = await this.customerModel.findOneAndDelete({ _id: id });

    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async addVehicle(customerId: string, dto: AddVehicleDto) {
    const customer = await this.customerModel.findById(customerId);
    if (!customer) throw new NotFoundException('Customer not found');

    const { make, model, number, odometer } = dto;

    customer.vehicles.push({
      make,
      model,
      number,
      odometer,
      createdAt: new Date(),
    });

    await customer.save();
  }

  async deleteVehicle(customerId: string, vehicleId: string) {
    const customer = await this.customerModel.findById(customerId);
    if (!customer) throw new NotFoundException('Customer not found');

    const vehicle = customer.vehicles.find(
      // @ts-ignore
      (v) => v._id.toString() === vehicleId,
    );
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    customer.vehicles = customer.vehicles.filter(
      // @ts-ignore
      (v) => v._id.toString() !== vehicleId,
    );

    await customer.save();
  }
}
