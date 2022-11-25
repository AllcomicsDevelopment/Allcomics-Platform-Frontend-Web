import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '@shared/shared.module';

import { LoginComponent } from './pages/login/login.component';
import { OauthResponseComponent } from './pages/oauth-response/oauth-response.component';
import { UnsubcriseComponent } from './pages/unsubcrise/unsubcrise.component';
import { UnsubcriseDialogComponent } from './components/unsubcrise-dialog/unsubcrise-dialog.component';
import { UnsubcriseAlertDialogComponent } from './components/unsubcrise-alert-dialog/unsubcrise-alert-dialog.component';

@NgModule({
    imports: [
        SharedModule,
        AuthRoutingModule,
    ],
    declarations: [
        // pages
        LoginComponent,
        OauthResponseComponent,
        UnsubcriseComponent,
        // components
        UnsubcriseDialogComponent,
        UnsubcriseAlertDialogComponent,
    ],
    entryComponents: [
        UnsubcriseDialogComponent,
        UnsubcriseAlertDialogComponent,
    ]
})
export class AuthModule { }
