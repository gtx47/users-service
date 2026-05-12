export interface TokenPayload {
  id?: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export interface TokenServicePort {
  verify(token: string): TokenPayload | null;
}
