import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../ports/user.repository';
import { IEmailService } from '../ports/email.service';
import { randomBytes, bytesToHex } from '@noble/hashes/utils';

export interface ForgotPasswordCommand {
  email: string;
}

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    @Inject('IEmailService')
    private readonly emailService: IEmailService,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<void> {
    const user = await this.userRepo.findByEmail(command.email);
    if (!user) {
      // Return silently to prevent email enumeration
      return;
    }

    const resetToken = bytesToHex(randomBytes(32));
    
    // Note: In a complete implementation, you should save this resetToken 
    // to the user entity or a separate table with an expiration time.
    // await this.userRepo.saveResetToken(user.id, resetToken);

    await this.emailService.sendPasswordResetEmail(user.email, resetToken);
  }
}