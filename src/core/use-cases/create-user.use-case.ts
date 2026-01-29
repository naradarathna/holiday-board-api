import { Inject, Injectable } from '@nestjs/common';
import { UserEntity, UserRole } from '../entities/user.entity';
import { IUserRepository } from '../ports/user.repository';

export interface CreateUserCommand {
  email: string;
  organizationId: string;
  role?: UserRole;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserEntity> {
    const user = new UserEntity(
      null,
      command.email,
      command.organizationId,
      command.role || UserRole.EMPLOYEE,
    );
    return await this.userRepo.save(user);
  }
}