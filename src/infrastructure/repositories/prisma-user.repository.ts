import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IUserRepository } from '../../core/ports/user.repository';
import { UserEntity, UserRole } from '../../core/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const data = {
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
    };

    const saved = user.id
      ? await this.prisma.user.update({ where: { id: user.id }, data })
      : await this.prisma.user.create({ data });

    return this.mapToDomain(saved);
  }

  private mapToDomain(record: any): UserEntity {
    return new UserEntity(record.id, record.email, record.organizationId, record.role as UserRole);
  }
}