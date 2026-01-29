// src/core/entities/leave-request.entity.ts
export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class LeaveRequestEntity {
  constructor(
    public readonly id: string | null,
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public status: LeaveStatus = LeaveStatus.PENDING,
  ) {
    this.validate();
  }

  private validate() {
    if (this.endDate < this.startDate) {
      throw new Error('End date cannot be before start date');
    }
  }
}