// src/core/ports/leave.repository.ts
import { LeaveRequestEntity } from '../entities/leave-request.entity';

export interface ILeaveRepository {
  save(leave: LeaveRequestEntity): Promise<LeaveRequestEntity>;
  findByOrg(organizationId: string): Promise<LeaveRequestEntity[]>;
}