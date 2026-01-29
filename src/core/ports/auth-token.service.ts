export interface IAuthTokenService {
  signToken(payload: any): string;
  verifyToken(token: string): any;
}