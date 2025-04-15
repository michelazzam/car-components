import { Body, Controller, Get } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@ApiTags('Organization')
@Controller({ version: '1', path: 'organization' })
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  async findOrganization() {
    return await this.organizationService.findOrganization();
  }

  @Get('update')
  async updateOrganization(@Body() dto: UpdateOrganizationDto) {
    await this.organizationService.updateOrganization(dto);

    return { message: 'Organization updated successfully' };
  }
}
