import { Injectable } from '@nestjs/common';
import { ISessionRepository } from '../../core/ports/session.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class InMemorySessionRepository implements ISessionRepository {
  private sessions = new Set<string>();

  async create(userId: string): Promise<string> {
    const sessionId = randomUUID();
    this.sessions.add(sessionId);
    return sessionId;
  }

  async invalidate(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }

  async isValid(sessionId: string): Promise<boolean> {
    return this.sessions.has(sessionId);
  }
}