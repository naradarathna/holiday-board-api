export interface ISessionRepository {
  create(userId: string): Promise<string>;
  invalidate(sessionId: string): Promise<void>;
  isValid(sessionId: string): Promise<boolean>;
}