import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { ErrorsService } from '../services/errors.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ErrorsHandler implements ErrorHandler {

    constructor(private injector: Injector) {
    }

    handleError(error: Error | HttpErrorResponse) {
        // console.log('intercept error: ', error);

        const errorsService = this.injector.get(ErrorsService);
        const router = this.injector.get(Router);
        const translateService = this.injector.get(TranslateService);

        if (!environment.production) {
            return;
        }

        if (error instanceof HttpErrorResponse) {
            if (!navigator.onLine) {
                translateService.get('error.not-available').subscribe(message => {
                    alert(message);
                });
            }

            // Http Error
            errorsService.doReportError(error).subscribe(() => {
            const errorMessage = error.message || error.statusText || 'Unknown Error!';
            alert(errorMessage);
            });
        } else {
            // Client Error Happened
            errorsService.doReportError(error).subscribe(() => {
                router.navigate(['/error']);
            });
        }
    }
}

