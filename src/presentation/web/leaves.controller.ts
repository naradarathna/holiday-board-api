import { Controller, Post, Body } from '@nestjs/common';
import { RequestLeaveUseCase } from '../../core/use-cases/request-leave.use-case';
import { CreateLeaveDto } from '../shared/create-leave.dto'; // Import the DTO

@Controller('leaves')
export class LeavesController {
  constructor(private readonly requestLeaveUseCase: RequestLeaveUseCase) {}

  @Post()
  async createLeave(@Body() createLeaveDto: CreateLeaveDto) { // Use the DTO type here
    return await this.requestLeaveUseCase.execute({
      userId: createLeaveDto.userId,
      organizationId: createLeaveDto.organizationId,
      startDate: new Date(createLeaveDto.startDate),
      endDate: new Date(createLeaveDto.endDate),
    });
  }
}