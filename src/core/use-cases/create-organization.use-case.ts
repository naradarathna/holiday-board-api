import { Inject, Injectable } from '@nestjs/common';
import { OrganizationEntity } from '../entities/organization.entity';
import { IOrganizationRepository } from '../ports/organization.repository';

export interface CreateOrganizationCommand {
  name: string;
}

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepo: IOrganizationRepository,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<OrganizationEntity> {
    const organization = new OrganizationEntity(null, command.name);
    return await this.organizationRepo.save(organization);
  }
}