import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { OauthResponseComponent } from './pages/oauth-response/oauth-response.component';
import { UnsubcriseComponent } from './pages/unsubcrise/unsubcrise.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'login', component: LoginComponent },
            { path: 'oauth-response', component: OauthResponseComponent },
            { path: 'unsubscribe', component: UnsubcriseComponent },
        ])
    ],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
