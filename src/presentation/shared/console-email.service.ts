import { Injectable, Logger } from '@nestjs/common';
import { IEmailService } from '../../core/ports/email.service';

@Injectable()
export class ConsoleEmailService implements IEmailService {
  private readonly logger = new Logger(ConsoleEmailService.name);

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    this.logger.log(`Sending password reset email to ${to} with token: ${token}`);
  }
}