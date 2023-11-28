import { Request } from 'express';

export interface UserTokens {
  accessToken: string;
  refreshToken: string;
  expires: number;
}

export interface UserAccount {
  name: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: UserAccount;
}