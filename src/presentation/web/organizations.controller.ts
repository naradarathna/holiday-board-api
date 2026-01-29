import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrganizationUseCase } from '../../core/use-cases/create-organization.use-case';
import { CreateOrganizationDto } from '../shared/create-organization.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly createOrganizationUseCase: CreateOrganizationUseCase) {}

  @Post()
  async createOrganization(@Body() createOrganizationDto: CreateOrganizationDto) {
    return await this.createOrganizationUseCase.execute({
      name: createOrganizationDto.name,
    });
  }
}