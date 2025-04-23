import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { IService, Service } from './service.schema';
import { InjectModel } from '@nestjs/mongoose';
import { AddServiceDto } from './dto/add-service.dto';
import { EditServiceDto } from './dto/edit-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name)
    private serviceModel: Model<IService>,
  ) {}

  async getAll() {
    return this.serviceModel.find().sort({ createdAt: -1 });
  }

  getManyByIds(ids: string[]) {
    return this.serviceModel.find({ _id: { $in: ids } }).lean();
  }

  async create(service: AddServiceDto) {
    return await this.serviceModel.create(service);
  }

  async editService(id: string, dto: EditServiceDto) {
    const service = await this.serviceModel.findOneAndUpdate({ _id: id }, dto);

    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async deleteService(id: string) {
    const service = await this.serviceModel.findOneAndDelete({ _id: id });

    if (!service) throw new NotFoundException('Service not found');
    return service;
  }
}
