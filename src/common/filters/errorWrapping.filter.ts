import { ErrorCodes } from '@/api/entities/enums/response-codes.enum';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { formatResponse } from '@/common/utils/utils.api';

@Injectable()
@Catch()
export class ErrorWrapperFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : ErrorCodes.InternalServerError;

    const formattedError = formatResponse(null, {
      error: exception,
    });

    this.logger.error(
      null,
      `Error ocurred on ${request.url} - ${status}
      Trace: ${exception.stack}`,
    );

    response.status(status).json({
      ...formattedError,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
