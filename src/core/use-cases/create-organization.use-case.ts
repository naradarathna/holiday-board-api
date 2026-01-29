import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { OrganizationEntity } from '../entities/organization.entity';
import { IOrganizationRepository } from '../ports/organization.repository';
import { UserEntity, UserRole } from '../entities/user.entity';
import { IUserRepository } from '../ports/user.repository';

export interface CreateOrganizationCommand {
  name: string;
  adminEmail: string;
}

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject('IOrganizationRepository')
    private readonly organizationRepo: IOrganizationRepository,
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<OrganizationEntity> {
    const organization = new OrganizationEntity(null, command.name);
    let savedOrganization: OrganizationEntity;

    try {
      savedOrganization = await this.organizationRepo.save(organization);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Organization with this name already exists');
      }
      throw error;
    }

    const adminUser = new UserEntity(
      null,
      command.adminEmail,
      savedOrganization.id!,
      UserRole.ORG_ADMIN,
    );

    try {
      await this.userRepo.save(adminUser);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }

    return savedOrganization;
  }
}