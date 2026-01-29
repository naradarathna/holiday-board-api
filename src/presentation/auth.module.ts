import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './web/auth.controller';
import { LoginUseCase } from '../core/use-cases/login.use-case';
import { LogoutUseCase } from '../core/use-cases/logout.use-case';
import { ForgotPasswordUseCase } from '../core/use-cases/forgot-password.use-case';
import { PrismaUserRepository } from '../infrastructure/repositories/prisma-user.repository';
import { PrismaSessionRepository } from '../infrastructure/repositories/prisma-session.repository';
import { JwtAuthTokenService } from './shared/jwt-auth-token.service';
import { ConsoleEmailService } from './shared/console-email.service';
import { PrismaService } from '../infrastructure/database/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    LogoutUseCase,
    ForgotPasswordUseCase,
    PrismaService,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'IAuthTokenService',
      useClass: JwtAuthTokenService,
    },
    {
      provide: 'IEmailService',
      useClass: ConsoleEmailService,
    },
    {
      provide: 'ISessionRepository',
      useClass: PrismaSessionRepository,
    },
  ],
  exports: ['IAuthTokenService', 'ISessionRepository'],
})
export class AuthModule {}