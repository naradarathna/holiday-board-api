import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../core/use-cases/create-user.use-case';
import { CreateUserDto } from '../shared/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.createUserUseCase.execute({
      email: createUserDto.email,
      password: createUserDto.password,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      organizationId: createUserDto.organizationId,
      role: createUserDto.role,
    });
  }
}