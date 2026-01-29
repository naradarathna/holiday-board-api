import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IOrganizationRepository } from '../../core/ports/organization.repository';
import { OrganizationEntity } from '../../core/entities/organization.entity';

@Injectable()
export class PrismaOrganizationRepository implements IOrganizationRepository {
  constructor(private prisma: PrismaService) {}

  async save(organization: OrganizationEntity): Promise<OrganizationEntity> {
    const saved = await this.prisma.organization.create({
      data: {
        name: organization.name,
      },
    });
    return new OrganizationEntity(saved.id, saved.name);
  }
}