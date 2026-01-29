// src/app.module.ts
import { Module } from '@nestjs/common';
import { LeavesController } from './presentation/web/leaves.controller'; // Import here
import { OrganizationsController } from './presentation/web/organizations.controller';
import { UsersController } from './presentation/web/users.controller';
import { RequestLeaveUseCase } from './core/use-cases/request-leave.use-case';
import { CreateOrganizationUseCase } from './core/use-cases/create-organization.use-case';
import { CreateUserUseCase } from './core/use-cases/create-user.use-case';
import { PrismaService } from './infrastructure/database/prisma.service';
import { PrismaLeaveRepository } from './infrastructure/repositories/prisma-leave.repository';
import { PrismaOrganizationRepository } from './infrastructure/repositories/prisma-organization.repository';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';

@Module({
  controllers: [LeavesController, OrganizationsController, UsersController], // Register here
  providers: [
    PrismaService,
    RequestLeaveUseCase,
    CreateOrganizationUseCase,
    CreateUserUseCase,
    {
      provide: 'ILeaveRepository',
      useClass: PrismaLeaveRepository,
    },
    {
      provide: 'IOrganizationRepository',
      useClass: PrismaOrganizationRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
  ],
})
export class AppModule {}