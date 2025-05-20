import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { IVehicleMakes, VehicleMakes } from './vehicle-makes.schema';
import { InjectModel } from '@nestjs/mongoose';
import { VehicleMakeDto } from './dto/vehicle-make.dto';
import { ModelDto } from './dto/model.dto';

@Injectable()
export class VehicleMakesService {
  constructor(
    @InjectModel(VehicleMakes.name)
    private vehicleMakesModel: Model<IVehicleMakes>,
  ) {}

  getAll() {
    return this.vehicleMakesModel.find().sort({ createdAt: -1 });
  }

  getSingleMake(id: string) {
    return this.vehicleMakesModel.findById(id);
  }

  createMake(dto: VehicleMakeDto) {
    return this.vehicleMakesModel.create(dto);
  }

  async editMake(id: string, dto: VehicleMakeDto) {
    const make = await this.vehicleMakesModel.findById(id);
    if (!make) throw new NotFoundException('Make not found');

    await this.vehicleMakesModel.findOneAndUpdate({ _id: id }, dto);
  }

  async deleteMake(id: string) {
    const make = await this.vehicleMakesModel.findById(id);
    if (!make) throw new NotFoundException('Make not found');

    await this.vehicleMakesModel.findOneAndDelete({ _id: id });
  }

  async createModel(makeId: string, dto: ModelDto) {
    const make = await this.vehicleMakesModel.findById(makeId);
    if (!make) throw new NotFoundException('Make not found');

    make.models.push(dto);
    const savedMake = await make.save();
    const modelName = dto.name;

    const createdModel = savedMake.models.find(
      (model) => model.name === modelName,
    );
    return createdModel;
  }

  async editModel(makeId: string, id: string, dto: ModelDto) {
    const make = await this.vehicleMakesModel.findById(makeId);
    if (!make) throw new NotFoundException('Make not found');

    // Find the subdocument by id using Mongoose's id() method
    const model = make.models.find((model) => model._id?.toString() === id);
    if (!model) throw new NotFoundException('Model not found');

    // Update the subdocument fields (assuming dto has fields to update)
    model.set(dto);

    await make.save();
  }

  async deleteModel(makeId: string, id: string) {
    const make = await this.vehicleMakesModel.findById(makeId);
    if (!make) throw new NotFoundException('Make not found');

    // Find the subdocument by id
    const model = make.models.find((model) => model._id?.toString() === id);
    if (!model) throw new NotFoundException('Model not found');

    // Remove the subdocument from the array
    model.deleteOne();

    await make.save();
  }
}
