import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(value => {
                value = (value) ? value : []
                if (value.hasOwnProperty('data')) {
                    const { data, ...pagination } = value;
                    return { status: "success", ...pagination, data };
                }
                else
                    return { status: "success", data: value };
            }));
    }
}