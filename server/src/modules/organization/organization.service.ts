import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { IOrganization, Organization } from './organization.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService implements OnModuleInit {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<IOrganization>,
  ) {}

  onModuleInit() {
    this.populateOrganization();
  }

  private async populateOrganization() {
    const org = await this.organizationModel.findOne();

    if (org) {
      console.log('Organization document already exists');
    } else {
      await this.organizationModel.create({
        name: 'Car Components',
      });

      console.log('Organization document created successfully');
    }
  }

  async findOrganization() {
    const org = await this.organizationModel.findOne();
    return org;
  }

  async updateOrganization(dto: UpdateOrganizationDto) {
    const { name, address, email, phoneNumber, tvaNumber, tvaPercentage } = dto;

    const organization = await this.organizationModel.findOne();
    if (!organization) throw new NotFoundException('Organization not found');

    await this.organizationModel.findByIdAndUpdate(organization._id, {
      name,
      address,
      email,
      phoneNumber,
      tvaNumber,
      tvaPercentage,
    });
  }
}
