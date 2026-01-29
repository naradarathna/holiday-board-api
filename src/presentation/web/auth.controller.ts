import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { LoginUseCase } from '../../core/use-cases/login.use-case';
import { LogoutUseCase } from '../../core/use-cases/logout.use-case';
import { ForgotPasswordUseCase } from '../../core/use-cases/forgot-password.use-case';
import { LoginDto, ForgotPasswordDto } from '../shared/auth.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return await this.loginUseCase.execute(dto);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: any) {
    const sessionId = req.user?.sessionId;
    if (sessionId) {
      return await this.logoutUseCase.execute(sessionId);
    }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.forgotPasswordUseCase.execute(dto);
  }
}