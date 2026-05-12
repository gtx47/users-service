import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  TokenPayload,
  TokenServicePort,
} from '../../domain/ports/token-service.port';

@Injectable()
export class JwtTokenService implements TokenServicePort {
  constructor(private readonly jwtService: JwtService) {}

  verify(token: string): TokenPayload | null {
    try {
      return this.jwtService.verify<TokenPayload>(token);
    } catch {
      return null;
    }
  }
}
