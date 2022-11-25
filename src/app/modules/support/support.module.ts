import { NgModule } from '@angular/core';
import { SupportRoutingModule } from './support-routing.module';

import { SharedModule } from '@shared/shared.module';

import { CustomerSupportComponent } from './pages/customer-support/customer-support.component';
import { NoticePageComponent } from '@app/modules/support/pages/notice/notice-page.component';

import { HistoryComponent } from './components/history/history.component';
import { HistoryDetailComponent } from './components/history-detail/history-detail.component';
import { InquiryComponent } from './components/inquiry/inquiry.component';
import { NoticeComponent } from './components/notice/notice.component';
import { NotificationDialogComponent } from './components/notification-dialog/notification-dialog.component';
import { FaqComponent } from '@app/modules/support/components/faq/faq.component';

import { StoreModule } from '@ngrx/store';
import { supportReducer } from '@app/modules/support/store/support.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SupportEffects } from '@app/modules/support/store/support.effects';

@NgModule({
    imports: [
        SharedModule,
        SupportRoutingModule,
        StoreModule.forFeature('support', supportReducer),
        EffectsModule.forFeature([
            SupportEffects
        ])
    ],
    declarations: [
        // pages
        CustomerSupportComponent,
        NoticePageComponent,
        // components
        HistoryComponent,
        HistoryDetailComponent,
        InquiryComponent,
        NoticeComponent,
        FaqComponent,
        NotificationDialogComponent,
    ],
    entryComponents: [
        NotificationDialogComponent,
    ]
})
export class SupportModule { }
