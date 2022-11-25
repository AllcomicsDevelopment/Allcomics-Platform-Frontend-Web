import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { BaseService } from '@core/services/base.service';
import { ComicService } from '@core/services/comic.service';

import { Observable, ReplaySubject } from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import * as fromRoot from '@app/store/root/root.reducer';
import * as fromPayment from '@app/modules/payment/store/payment.reducer';

@Component({
    selector: 'app-finish',
    templateUrl: './finish.component.html',
    styleUrls: ['./finish.component.scss']
})
export class FinishComponent implements OnInit, OnDestroy {

    public routeParams;
    public data;
    public cardNum = '';
    public amount$: Observable<number>;
    private cardNum$: Observable<string>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(public dialog: MatDialog,
                public router: Router,
                private rootStore$: Store<fromRoot.State>,
                private paymentStore$: Store<fromPayment.State>,
                private activatedRoute: ActivatedRoute,
                private lemonAuthService: BaseService) {
    }

    ngOnInit() {
        this.routeParams = this.activatedRoute.snapshot.queryParams;
        this.data = this.activatedRoute.snapshot.data;
        this.setupReducerListener();
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    onClickFinish() {
        const hasRedirectPath = this.routeParams.hasOwnProperty('redirectPath');
        if (hasRedirectPath) {
            const { redirectPath } = this.routeParams;
            this.router.navigate(['/'], { replaceUrl: true }).then(() => this.router.navigate([`${redirectPath}`]));
        } else {
            this.router.navigate(['/'], { replaceUrl: true });
        }
    }

    private addMaskAndSpace(cardNum: string) {
        const maskNum = cardNum.replace(/\d(?=\d{4})/g, '*');
        const maskNumWithSpace = maskNum.match(/.{1,4}/g);
        this.cardNum = maskNumWithSpace.join(' ');
    }

    private setupReducerListener() {
        this.amount$ = this.paymentStore$.pipe(select(fromPayment.getToChargeData), filter(data => !!data), map(data => data.amount), takeUntil(this.destroyed$));
        this.cardNum$ = this.paymentStore$.pipe(
            select(fromPayment.getToChargeData),
            filter(data => !!data),
            map(data => data.paymentData),
            filter(paymentData => !!paymentData.cardNumber),
            map(paymentData => paymentData.cardNumber),
            takeUntil(this.destroyed$)
        );
        this.cardNum$.subscribe(cardNumber => this.addMaskAndSpace(cardNumber));
    }
}
