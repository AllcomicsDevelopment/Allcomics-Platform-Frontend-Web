import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BillingComponent } from './pages/billing/billing.component';
import { ChargeComponent } from '@app/modules/payment/pages/charge/charge.component';
import { FinishComponent } from '@app/modules/payment/pages/finish/finish.component';
import { HistoryComponent } from '@app/modules/payment/pages/history/history.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: BillingComponent },
            { path: ':language/:userID', component: BillingComponent },
            { path: 'charge', component: ChargeComponent },
            { path: 'finish', component: FinishComponent },
            { path: 'history', component: HistoryComponent },
        ])
    ],
    exports: [RouterModule]
})
export class PaymentRoutingModule {}
