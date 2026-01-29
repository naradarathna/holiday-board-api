import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { OrganizationEntity } from '../entities/organization.entity';
import { IOrganizationRepository } from '../ports/organization.repository';
import { UserEntity, UserRole } from '../entities/user.entity';
import { IUserRepository } from '../ports/user.repository';
import { scryptAsync } from '@noble/hashes/scrypt';
import { randomBytes, bytesToHex } from '@noble/hashes/utils';

export interface CreateOrganizationCommand {
  name: string;
  adminEmail: string;
  adminPassword: string;
  adminFirstName: string;
  adminLastName: string;
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

    const salt = randomBytes(16);
    const key = await scryptAsync(command.adminPassword, salt, { N: 16384, r: 8, p: 1, dkLen: 32 });
    const passwordHash = `${bytesToHex(salt)}:${bytesToHex(key)}`;

    const adminUser = new UserEntity(
      null,
      command.adminEmail,
      passwordHash,
      command.adminFirstName,
      command.adminLastName,
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