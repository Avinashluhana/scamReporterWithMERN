
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppLogger } from 'src/app.logger';

@Injectable()
export class PerformanceMonitorInterceptor implements NestInterceptor {

  private readonly logger = new AppLogger(PerformanceMonitorInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handlerfnName = context.getHandler().name;
    const className = context.getClass().name;
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => this.logger.log(`[${className}] ${handlerfnName} takes ${Date.now() - now}ms to complete`)),
      );
  }
}