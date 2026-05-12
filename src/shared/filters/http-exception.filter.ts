import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('UsersExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      if (typeof body === 'string') {
        response.status(status).json({ success: false, error: body });
        return;
      }

      const payload = body as Record<string, unknown>;
      const error =
        (payload.error as string | undefined) ??
        (payload.message as string | undefined) ??
        'Error';

      response.status(status).json({ success: false, ...payload, error });
      return;
    }

    this.logger.error('[users] error global', exception as Error);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: 'Error interno del servicio de users',
    });
  }
}
