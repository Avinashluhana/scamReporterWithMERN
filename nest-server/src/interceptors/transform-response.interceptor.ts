import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppLogger } from 'src/app.logger';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {

  private readonly logger = new AppLogger(TransformResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    this.logger.log(`${this.intercept.name} was called`);
    return next.handle().pipe(map(data => ({ "statusCode": 200, data })));
  }
}