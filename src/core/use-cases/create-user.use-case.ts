import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { UserEntity, UserRole } from '../entities/user.entity';
import { IUserRepository } from '../ports/user.repository';
import { scryptAsync } from '@noble/hashes/scrypt';
import { randomBytes, bytesToHex } from '@noble/hashes/utils';

export interface CreateUserCommand {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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
    const salt = randomBytes(16);
    const key = await scryptAsync(command.password, salt, { N: 16384, r: 8, p: 1, dkLen: 32 });
    const passwordHash = `${bytesToHex(salt)}:${bytesToHex(key)}`;

    const user = new UserEntity(
      null,
      command.email,
      passwordHash,
      command.firstName,
      command.lastName,
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