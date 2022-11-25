import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CustomerSupportComponent } from './pages/customer-support/customer-support.component';
import { NoticePageComponent } from '@app/modules/support/pages/notice/notice-page.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CustomerSupportComponent },
            { path: 'notice', component: NoticePageComponent },
            { path: 'history-detail/:id', component: CustomerSupportComponent },
        ])
    ],
    exports: [RouterModule]
})
export class SupportRoutingModule {}
