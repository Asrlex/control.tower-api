import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: any, res: any, next: (error?: Error | any) => void) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(
        `${method} ${originalUrl} ${res.statusCode} - ${duration}ms`,
        'RequestLogger',
      );
    });

    next();
  }
}
