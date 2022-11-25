import { NgModule } from '@angular/core';

import { CreditCardDirectivesModule } from 'angular-cc-library';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TextMaskModule } from 'angular2-text-mask';

import { PaymentRoutingModule } from './payment-routing.module';

import { SharedModule } from '@shared/shared.module';
import { paymentReducer } from '@app/modules/payment/store/payment.reducer';
import { PaymentEffects } from '@app/modules/payment/store/payment.effects';

import { ChargeComponent } from '@app/modules/payment/pages/charge/charge.component';
import { BillingComponent } from './pages/billing/billing.component';
import { FinishComponent } from '@app/modules/payment/pages/finish/finish.component';
import { HistoryComponent } from '@app/modules/payment/pages/history/history.component';

import { BillingDialogComponent } from './components/billing-dialog/billing-dialog.component';
import { PayIconComponent } from '@app/modules/payment/components/pay-icon/pay-icon.component';
import { HistoryItemComponent } from '@app/modules/payment/components/history-item/history-item.component';

@NgModule({
    imports: [
        SharedModule,
        PaymentRoutingModule,
        CreditCardDirectivesModule,
        TextMaskModule,
        StoreModule.forFeature('payment', paymentReducer),
        EffectsModule.forFeature([
            PaymentEffects
        ])
    ],
    declarations: [
        // pages
        BillingComponent,
        ChargeComponent,
        FinishComponent,
        HistoryComponent,
        // components
        BillingDialogComponent,
        PayIconComponent,
        HistoryItemComponent,
    ],
    entryComponents: [
        BillingDialogComponent,
    ]
})
export class PaymentModule { }
