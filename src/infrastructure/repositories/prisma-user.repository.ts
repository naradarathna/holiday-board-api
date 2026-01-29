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

  async findByEmail(email: string): Promise<UserEntity | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const data = {
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      organizationId: user.organizationId,
      role: user.role,
    };

    const saved = user.id
      ? await this.prisma.user.update({ where: { id: user.id }, data })
      : await this.prisma.user.create({ data });

    return this.mapToDomain(saved);
  }

  private mapToDomain(record: any): UserEntity {
    return new UserEntity(
      record.id,
      record.email,
      record.password,
      record.firstName,
      record.lastName,
      record.organizationId,
      record.role as UserRole,
    );
  }
}