import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ErrorsComponent } from './pages/errors/errors.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ErrorsComponent },
        ])
    ],
    exports: [RouterModule]
})
export class ErrorRoutingModule { }
