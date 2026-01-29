import { Inject, Injectable } from '@nestjs/common';
import { ISessionRepository } from '../ports/session.repository';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject('ISessionRepository')
    private readonly sessionRepo: ISessionRepository,
  ) {}

  async execute(sessionId: string): Promise<void> {
    await this.sessionRepo.invalidate(sessionId);
  }
}