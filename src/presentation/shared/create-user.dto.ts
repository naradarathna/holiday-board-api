import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { UserRole } from '../../core/entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}