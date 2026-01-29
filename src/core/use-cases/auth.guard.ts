import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { IAuthTokenService } from '../ports/auth-token.service';
import { ISessionRepository } from '../ports/session.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('IAuthTokenService') private readonly tokenService: IAuthTokenService,
    @Inject('ISessionRepository') private readonly sessionRepo: ISessionRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = this.tokenService.verifyToken(token);
      if (payload.sessionId) {
        const isValid = await this.sessionRepo.isValid(payload.sessionId);
        if (!isValid) {
          throw new UnauthorizedException('Session expired or invalid');
        }
      }
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}