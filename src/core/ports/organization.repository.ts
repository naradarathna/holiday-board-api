import { OrganizationEntity } from '../entities/organization.entity';

export interface IOrganizationRepository {
  save(organization: OrganizationEntity): Promise<OrganizationEntity>;
}