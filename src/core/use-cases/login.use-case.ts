import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../ports/user.repository';
import { IAuthTokenService } from '../ports/auth-token.service';
import { ISessionRepository } from '../ports/session.repository';
import { scryptAsync } from '@noble/hashes/scrypt';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

export interface LoginCommand {
  email: string;
  password: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    @Inject('IAuthTokenService')
    private readonly tokenService: IAuthTokenService,
    @Inject('ISessionRepository')
    private readonly sessionRepo: ISessionRepository,
  ) {}

  async execute(command: LoginCommand): Promise<{ accessToken: string }> {
    const user = await this.userRepo.findByEmail(command.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const [saltHex, keyHex] = user.password.split(':');
    if (!saltHex || !keyHex) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const salt = hexToBytes(saltHex);
    const key = await scryptAsync(command.password, salt, { N: 16384, r: 8, p: 1, dkLen: 32 });
    const derivedKeyHex = bytesToHex(key);

    if (keyHex !== derivedKeyHex) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.id) {
      throw new UnauthorizedException('Invalid user identifier');
    }

    const sessionId = await this.sessionRepo.create(user.id);

    const payload = { sub: user.id, email: user.email, role: user.role, sessionId };
    const accessToken = this.tokenService.signToken(payload);

    return { accessToken };
  }
}