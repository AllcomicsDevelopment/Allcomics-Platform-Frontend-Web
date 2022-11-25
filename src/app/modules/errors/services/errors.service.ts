import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router, Event, NavigationError } from '@angular/router';
import { Injectable, Injector} from '@angular/core';
import { HttpEvent } from '@angular/common/http';

import { AWSSNSService } from './aws-sns.service';

import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ErrorsService {

    constructor(private injector: Injector,
                private router: Router,
                private awsSnsService: AWSSNSService) {
        const navigationError$ = this.router.events.pipe(filter((event: Event) => event instanceof NavigationError));
        navigationError$.subscribe(error => {
            this.router.navigate(['/error']);
            this.doReportError(error);
        });
    }

    doReportError(error: any): Observable<HttpEvent<any>> {
        const targetArn = this.getTargetArn();
        const payload = this.getErrorPayload(error);
        return this.awsSnsService.publishPayload(targetArn, payload);
    }

    getErrorContext(error: any): any {
        const location = this.injector.get(LocationStrategy);
        const url = location instanceof PathLocationStrategy ? location.path() : '';
        const status = error.status || null;
        const message = error.message || error.toString();

        return { url, status, message };
    }

    private getTargetArn() {
        const targetArn = environment.target_arn || 'arn:aws:sns:ap-northeast-2:085403634746:lemon-hello-sns';
        return targetArn;
    }

    private getErrorPayload(e: any) {
        const message = e.message || e.statusMessage || e.statusText || '';
        const stack = e instanceof Error ? e.stack : this.getErrorContext(e);
        const error = typeof e === 'string' ? e : e instanceof Error ? `${e.message}` : JSON.stringify(e);
        const errors = e.errors || (e.body && e.body.errors) || undefined;
        const payload = {
            'stack-trace': stack,
            message,
            error,
            errors
        };

        return payload;
    }

}

