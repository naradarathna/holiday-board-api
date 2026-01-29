import { Injectable } from '@nestjs/common';
import { ISessionRepository } from '../../core/ports/session.repository';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PrismaSessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string): Promise<string> {
    // Session valid for 1 hour
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const session = await this.prisma.session.create({
      data: {
        userId,
        expiresAt,
      },
    });
    return session.id;
  }

  async invalidate(sessionId: string): Promise<void> {
    try {
      await this.prisma.session.delete({
        where: { id: sessionId },
      });
    } catch {
      // Session might already be deleted
    }
  }

  async isValid(sessionId: string): Promise<boolean> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) await this.invalidate(sessionId);
      return false;
    }

    return true;
  }
}