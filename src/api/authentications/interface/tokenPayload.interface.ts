export interface TokenPayload {
  name: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
  iss?: string;
  sub?: string;
}
