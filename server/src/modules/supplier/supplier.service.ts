import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ISupplier, Supplier } from './supplier.schema';
import { FilterQuery, Model } from 'mongoose';
import { GetSuppliersDto } from './dto/get-suppliers.dto';
import { AddSupplierDto } from './dto/add-supplier.dto';
import { EditSupplierDto } from './dto/edit-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name)
    private supplierModel: Model<ISupplier>,
  ) {}

  getOneById(id: string) {
    return this.supplierModel.findById(id);
  }

  async getAll(dto: GetSuppliersDto) {
    const { pageIndex, search, pageSize } = dto;

    const filter: FilterQuery<ISupplier> = {};

    // Add search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [suppliers, totalCount] = await Promise.all([
      this.supplierModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(pageIndex * pageSize)
        .limit(pageSize),
      this.supplierModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      suppliers,
      pagination: {
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  async create(supplier: AddSupplierDto) {
    return await this.supplierModel.create(supplier);
  }

  async editSupplier(id: string, dto: EditSupplierDto) {
    const supplier = await this.supplierModel.findOneAndUpdate(
      { _id: id },
      dto,
    );

    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  async deleteSupplier(id: string) {
    const supplier = await this.supplierModel.findOneAndDelete({ _id: id });

    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }
}
