export interface IEmailService {
  sendPasswordResetEmail(to: string, token: string): Promise<void>;
}