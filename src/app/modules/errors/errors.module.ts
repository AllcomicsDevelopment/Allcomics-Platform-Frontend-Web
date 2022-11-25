import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { ErrorsHandler } from './handlers/errors.handler';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';

import { ErrorRoutingModule } from './errors-routing.module';
import { ErrorsComponent } from './pages/errors/errors.component';
import { ErrorsService } from './services/errors.service';
import { AWSSNSService } from './services/aws-sns.service';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        ErrorRoutingModule,
    ],
    declarations: [
        ErrorsComponent
    ],
    providers: [
        ErrorsService,
        AWSSNSService,
        { provide: ErrorHandler, useClass: ErrorsHandler },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true },
    ],
})
export class ErrorsModule { }
