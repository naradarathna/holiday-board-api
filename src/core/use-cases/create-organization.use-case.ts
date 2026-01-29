import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { OrganizationEntity } from '../entities/organization.entity';
import { IOrganizationRepository } from '../ports/organization.repository';
import { UserEntity, UserRole } from '../entities/user.entity';
import { IUserRepository } from '../ports/user.repository';
import { scryptAsync } from '@noble/hashes/scrypt';
import { randomBytes, bytesToHex } from '@noble/hashes/utils';
import { PrismaService } from '../../infrastructure/database/prisma.service';

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
    private readonly prisma: PrismaService,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<OrganizationEntity> {
    try {
      const savedOrganization = await this.prisma.$transaction(async (tx) => {
        const organization = new OrganizationEntity(null, command.name);

        const createdOrg = await tx.organization.create({
          data: { name: organization.name },
        });

        const savedOrganization = new OrganizationEntity(createdOrg.id, createdOrg.name);

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

        const { id, ...adminUserData } = adminUser;
        await tx.user.create({ data: adminUserData });

        return savedOrganization;
      });

      return savedOrganization;
    } catch (error: any) {
      if (error.code === 'P2002') {
        if (error.meta?.modelName?.includes('Organization')) {
          throw new ConflictException('Organization with this name already exists');
        } else if (error.meta?.modelName?.includes('User')) {
          throw new ConflictException('User with this email already exists');
        }
      }
      throw error;
    }
  }
}