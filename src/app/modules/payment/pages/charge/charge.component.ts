import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '@core/services/utils.service';

import { TemplateInfo } from '@app/models/templateInfo';
import { BillingDialogComponent } from '../../components/billing-dialog/billing-dialog.component';

import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import * as fromRoot from '@app/store/root/root.reducer';
import * as fromPayment from '@app/modules/payment/store/payment.reducer';
import * as PaymentActions from '@app/modules/payment/store/payment.actions';
import { ChargeTDNBody } from '@app/modules/payment/store/payment.actions';

@Component({
    selector: 'app-charge',
    templateUrl: './charge.component.html',
    styleUrls: ['./charge.component.scss']
})
export class ChargeComponent implements OnInit, OnDestroy {

    public cardNum: any;
    public cardExpireDate: any;
    public country: any;
    public address: any;
    public locality: any;
    public administrativeArea: any;
    public postalCode: any;
    public firstName: any;
    public lastName: any;
    public email: any;
    public alertMessage = '';

    public chargeData$: Observable<ChargeTDNBody>;
    public amount$: Observable<number>;
    public templateInfo: TemplateInfo;
    public isAuthenticated$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(public dialog: MatDialog,
                public router: Router,
                private location: Location,
                private rootStore$: Store<fromRoot.State>,
                private paymentStore$: Store<fromPayment.State>,
                private utils: UtilsService,
                private translate: TranslateService) {
    }

    ngOnInit() {
        this.setTemplateInfo();
        this.getTranslateText();
        this.setupReducerListener();
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    onClickPayment() {
        if (!this.validateInput()) {
            this.dialog.open(BillingDialogComponent, {
                width: '300px',
                hasBackdrop: true,
                data: { messages: this.alertMessage }
            });
            return;
        }

        const [cardExpMonth, cardExpYear] = this.cardExpireDate.split('/').map(date => date.trim());
        const cardNumStr = this.cardNum.replace(/ /gi, '');
        const cardType = this.utils.getCardType(Number(cardNumStr));
        const paymentData = {
            firstName: this.firstName,
            cardNumber: cardNumStr,
            cardExpMonth,
            cardExpYear,
            cardType,
            country: this.country,
            address1: this.address,
            administrativeArea: this.administrativeArea || '',
            postalCode: this.postalCode || '',
            locality: this.locality,
            email: this.email,
        };
        this.paymentStore$.dispatch(PaymentActions.SetAdditionalPaymentData({ data: paymentData }));
        this.paymentStore$.dispatch(PaymentActions.ChargeTDNDirectly());
    }

    private setupReducerListener() {
        this.chargeData$ = this.paymentStore$.pipe(select(fromPayment.getToChargeData), takeUntil(this.destroyed$));
        this.amount$ = this.paymentStore$.pipe(select(fromPayment.getToChargeData), filter(data => !!data), map(data => data.amount), takeUntil(this.destroyed$));

        this.chargeData$.subscribe(data => {
            if (!data) {
                this.location.back();
            }
        });
    }

    private validateInput() {
        if (!this.cardExpireDate || !this.firstName || !this.lastName || !this.cardNum || !this.email || !this.country || !this.locality || !this.address) {
            return false;
        }

        const shouldDefineAdministrativeArea = this.country === 'US' || this.country === 'CA';
        if (shouldDefineAdministrativeArea) {
            if (!this.administrativeArea || !this.postalCode) {
                return false;
            }
        }

        if (this.cardExpireDate) {
            const [cardExpMonth, cardExpYear] = this.cardExpireDate.split('/').map(date => date.trim());
            if (cardExpYear.length < 4) {
                return false;
            }
        }
        return true;
    }

    private setTemplateInfo() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 7;
        this.templateInfo.botbar = false;
        this.templateInfo.txtTitle = 'billing';
    }

    private getTranslateText() {
        this.translate.get('billing.alert-message').subscribe(text => this.alertMessage = text);
    }

    public getPostalCodeMask(country: 'CA' | 'US') {
        const postalCodeMask = {
            CA: [/^[A-Za-z]/, /\d/, /[A-Za-z]/, /[ ]/, /\d/, /[A-Za-z]/, /\d/],
            US: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
        };
        return postalCodeMask[country] || postalCodeMask['US'];
    }

    public resetForm() {
        this.postalCode = '';
        this.administrativeArea = '';
    }
}
