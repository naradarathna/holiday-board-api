import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LeaveRequestEntity, LeaveStatus } from '../entities/leave-request.entity';
import { ILeaveRepository } from '../ports/leave.repository';

export interface RequestLeaveCommand {
  userId: string;
  organizationId: string;
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class RequestLeaveUseCase {
  constructor(
    // We use @Inject('ILeaveRepository') because interfaces disappear at runtime
    @Inject('ILeaveRepository') 
    private readonly leaveRepo: ILeaveRepository,
  ) {}

  async execute(command: RequestLeaveCommand): Promise<LeaveRequestEntity> {
    
    // 1. Create the Entity (This triggers the internal date validation you wrote)
    const leaveRequest = new LeaveRequestEntity(
      null,
      command.userId,
      command.organizationId,
      command.startDate,
      command.endDate,
      LeaveStatus.PENDING,
    );

    // 2. Industry-Level Check: Add a rule here later to check if the user
    // has enough balance or if dates overlap.

    // 3. Save via the Repository Port
    try {
      return await this.leaveRepo.save(leaveRequest);
    } catch (error: any) {
      if (error.code === 'P2003') {
        // Check which field caused the foreign key violation
        if (error.meta?.field_name?.includes('userId') || error.message?.includes('userId')) {
          throw new BadRequestException('User ID is incorrect or does not exist');
        }
        if (error.meta?.field_name?.includes('organizationId') || error.message?.includes('organizationId')) {
          throw new BadRequestException('Organization ID is incorrect or does not exist');
        }
        throw new BadRequestException('User ID or Organization ID is incorrect or does not exist');
      }
      throw error;
    }
  }
}