import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthTokenService } from '../../core/ports/auth-token.service';

@Injectable()
export class JwtAuthTokenService implements IAuthTokenService {
  constructor(private readonly jwtService: JwtService) {}

  signToken(payload: any): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }
}