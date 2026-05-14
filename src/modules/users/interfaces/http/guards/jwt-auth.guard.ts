import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TOKEN_SERVICE } from '../../../users.tokens';
import {
  TokenPayload,
  TokenServicePort,
} from '../../../domain/ports/token-service.port';

export type AuthenticatedRequest = Request & { user?: TokenPayload };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenServicePort,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = (request.headers.authorization as string) || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';

    if (!token) {
      throw new UnauthorizedException('Token requerido');
    }

    const payload = this.tokenService.verify(token);
    if (!payload) {
      throw new UnauthorizedException('Token inválido');
    }

    request.user = payload;
    return true;
  }
}
