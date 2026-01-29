import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
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
    try {
      return await this.userRepo.save(user);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('User with this email already exists');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException('Organization ID is incorrect or does not exist');
      }
      throw error;
    }
  }
}