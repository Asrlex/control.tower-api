import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { catchError, Observable, timeout } from 'rxjs';

@Injectable()
export class TimeoutInterceptor {
  constructor(private readonly logger: Logger) {
    this.logger.log(`\tTimeoutInterceptor initialized`);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(10000),
      catchError((err) => {
        if (err.name === 'TimeoutError') {
          throw new Error('Timeout error');
        }
        return Promise.reject(err);
      }),
    );
  }
}
