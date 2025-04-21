import { Body, Controller, Get, Put } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Permissions } from '../user/decorators/permissions.decorator';

@ApiTags('Organization')
@Controller({ version: '1', path: 'organization' })
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Permissions('Organization', 'read')
  @Get()
  async findOrganization() {
    return await this.organizationService.findOrganization();
  }

  @Permissions('Organization', 'update')
  @Put('update')
  async updateOrganization(@Body() dto: UpdateOrganizationDto) {
    await this.organizationService.updateOrganization(dto);

    return { message: 'Organization updated successfully' };
  }
}
