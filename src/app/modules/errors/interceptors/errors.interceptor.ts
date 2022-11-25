import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';

import { ErrorsService } from '../services/errors.service';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {

    constructor(private errorsService: ErrorsService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            retry(3),
            catchError((error: HttpErrorResponse) => {
                return this.errorsService.doReportError(error).pipe(
                    switchMap(() => throwError(error))
                );
            })
        );
    }
}
