// src/infrastructure/repositories/prisma-leave.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ILeaveRepository } from '../../core/ports/leave.repository';
import { LeaveRequestEntity, LeaveStatus } from '../../core/entities/leave-request.entity';

@Injectable()
export class PrismaLeaveRepository implements ILeaveRepository {
  constructor(private prisma: PrismaService) {}

  async save(leave: LeaveRequestEntity): Promise<LeaveRequestEntity> {
    const saved = await this.prisma.leaveRequest.create({
      data: {
        startDate: leave.startDate,
        endDate: leave.endDate,
        userId: leave.userId,
        organizationId: leave.organizationId,
        status: leave.status,
      },
    });
    
    // Convert DB record back to your Domain Entity
    return this.mapToDomain(saved);
  }

  async findByOrg(organizationId: string): Promise<LeaveRequestEntity[]> {
    const leaves = await this.prisma.leaveRequest.findMany({
      where: { organizationId }, // Industry-level multi-tenant filtering
    });
    return leaves.map(l => this.mapToDomain(l));
  }

  private mapToDomain(record: any): LeaveRequestEntity {
    return new LeaveRequestEntity(
      record.id,
      record.userId,
      record.organizationId,
      record.startDate,
      record.endDate,
      record.status as LeaveStatus,
    );
  }
}