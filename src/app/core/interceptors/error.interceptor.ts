import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, delay, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/error-handler.service';
import { TranslateService } from '@ngx-translate/core';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const errorHandler = inject(ErrorHandlerService);
    const translate = inject(TranslateService);

    if (Math.random() < 0.2 && req.url.includes('users')) {
        return throwError(() => new HttpErrorResponse({
            error: translate.instant('ERROR.RANDOM'),
            status: 666,
            statusText: 'Random error'
        })).pipe(delay(1000));
    }

    return next(req).pipe(
        catchError(error => {
            return throwError(() => errorHandler.handleError(error));
        })
    );
};
