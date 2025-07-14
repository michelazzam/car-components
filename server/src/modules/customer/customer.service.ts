import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, ICustomer, IVehicle, Vehicle } from './customer.schema';
import { FilterQuery, Model } from 'mongoose';
import { AddCustomerDto } from './dto/add-customer.dto';
import { EditCustomerDto } from './dto/edit-customer.dto';
import { GetCustomersDto } from './dto/get-customers.dto';
import { AddVehicleDto } from './dto/add-vehicle.dto';
import { EditVehicleDto } from './dto/edit-vehicle.dto';
import { GetVehiclesDto } from './dto/get-vehicles.dto';
import { IInvoice, Invoice } from '../invoice/invoice.schema';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private customerModel: Model<ICustomer>,
    @InjectModel(Vehicle.name)
    private vehicleModel: Model<IVehicle>,
    @InjectModel(Invoice.name)
    private invoiceModel: Model<IInvoice>,
  ) {}

  //-----------------------------GET SINGLE CUSTOMER-----------------------------
  async getOneById(id: string) {
    return this.customerModel.findById(id).populate('vehicles');
  }

  //-----------------------------GET ALL CUSTOMERS-----------------------------
  async getAll(dto: GetCustomersDto) {
    const { pageIndex, search, pageSize, onlyHasLoan } = dto;

    const filter: FilterQuery<ICustomer> = {};

    // Add search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (onlyHasLoan === 'true') {
      filter.loan = { $gt: 0 };
    } else if (onlyHasLoan === 'false') {
      filter.loan = { $eq: 0 };
    }

    const [customers, totalCount] = await Promise.all([
      this.customerModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .populate('vehicles')
        .lean(),
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

  //-----------------------------ADD CUSTOMER-----------------------------
  async create(customer: AddCustomerDto) {
    return await this.customerModel.create(customer);
  }

  //-----------------------------EDIT CUSTOMER-----------------------------
  async editCustomer(id: string, dto: EditCustomerDto) {
    const customer = await this.customerModel.findOneAndUpdate(
      { _id: id },
      dto,
    );

    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  //-----------------------------DELETE CUSTOMER-----------------------------
  async deleteCustomer(id: string) {
    // do not allow deleting if used by any invoice
    const invoice = await this.invoiceModel.findOne({ customer: id });
    if (invoice)
      throw new BadRequestException(
        'Can not delete Customer that is linked to an invoice',
      );

    const customer = await this.customerModel.findOneAndDelete({ _id: id });

    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  //---------------------------------------------------------------------VEHICLES----------------
  async addVehicle(customerId: string, dto: AddVehicleDto) {
    const customer = await this.customerModel.findById(customerId);
    if (!customer) throw new NotFoundException('Customer not found');

    const { make, model, number, odometer, unit } = dto;

    // create the vehicle
    const vehicle = await this.vehicleModel.create({
      make,
      model,
      number,
      odometer,
      unit,
      customer: customer._id,
    });

    // link it to the customer
    customer.vehicles.push(vehicle._id);
    await customer.save();
  }

  //-----------------------------GET ALL CUSTOMER VEHICLES-----------------------------
  async getAllVehicles(dto: GetVehiclesDto) {
    const { pageIndex = 0, pageSize = 10, search, customerId } = dto;

    // 1. Start with an empty filter
    const filter: FilterQuery<IVehicle> = {};

    // 2. Text‐search on make/model/number
    if (search) {
      filter.$or = [
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { number: { $regex: search, $options: 'i' } },
      ];
    }

    // 3. If a customerId was passed, restrict to their vehicles
    if (customerId) {
      const customer = await this.customerModel
        .findById(customerId)
        .select('vehicles');
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
      filter._id = { $in: customer.vehicles as any[] };
    }

    // 4. Fetch paginated vehicles + total count
    const [vehicles, totalCount] = await Promise.all([
      this.vehicleModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .lean(),
      this.vehicleModel.countDocuments(filter),
    ]);

    // 5. Compute total pages
    const totalPages = Math.ceil(totalCount / pageSize);

    // 6. Return payload with pagination metadata
    return {
      vehicles,
      pagination: {
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  //-----------------------------EDIT VEHICLE-----------------------------
  async editVehicle(
    customerId: string,
    vehicleId: string,
    dto: EditVehicleDto,
  ) {
    const customer = await this.customerModel.findById(customerId);
    if (!customer) throw new NotFoundException('Customer not found');

    const { make, model, number, odometer, unit } = dto;

    // update the vehicle
    const previousVehicle = await this.vehicleModel.findById(vehicleId);
    if (!previousVehicle) throw new NotFoundException('Vehicle not found');

    const updatedVehicle = await this.vehicleModel.findByIdAndUpdate(
      vehicleId,
      {
        customer: customerId,
        make,
        model,
        number,
        odometer,
        unit,
      },
    );

    if (!updatedVehicle) throw new NotFoundException('Vehicle not found');

    //only if id has been changed
    if (previousVehicle.customer.toString() !== customerId) {
      // remove vehicle from previous customer
      const previousCustomer = await this.customerModel.findById(
        previousVehicle.customer,
      );
      if (!previousCustomer) throw new NotFoundException('Customer not found');

      previousCustomer.vehicles = previousCustomer.vehicles.filter(
        (v) => v.toString() !== vehicleId,
      );
      await previousCustomer.save();

      //add vehicle to new customer
      customer.vehicles.push(updatedVehicle._id);
      await customer.save();
    }

    return updatedVehicle;
  }

  //-----------------------------DELETE VEHICLE-----------------------------
  async deleteVehicle(customerId: string, vehicleId: string) {
    const customer = await this.customerModel.findById(customerId);
    if (!customer) throw new NotFoundException('Customer not found');

    // do not allow deleting if used by any invoice
    const invoice = await this.invoiceModel.findOne({ vehicle: vehicleId });
    if (invoice)
      throw new BadRequestException(
        'Can not delete Vehicle that is linked to an invoice',
      );

    // remove the vehicle from the customer
    customer.vehicles = customer.vehicles.filter(
      (v) => v.toString() !== vehicleId,
    );
    await customer.save();

    // delete the vehicle
    await this.vehicleModel.deleteOne({ _id: vehicleId });
  }
}
