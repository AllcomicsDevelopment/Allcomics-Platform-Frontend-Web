import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { BaseService } from '@core/services/base.service';
import { ComicService } from '@core/services/comic.service';

import { TemplateInfo } from '@app/models/templateInfo';
import { BillingDialogComponent } from '../../components/billing-dialog/billing-dialog.component';
import { LoginDialogComponent } from '@shared/components/login-dialog/login-dialog.component';

import { Observable, ReplaySubject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import * as fromRoot from '@app/store/root/root.reducer';
import * as RootActions from '@app/store/root/root.actions';

import * as fromPayment from '../../store/payment.reducer';
import * as PaymentActions from '../../store/payment.actions';

import { ChargeTDNBody } from '../../store/payment.actions';
import { RouterExtensionService } from '@core/services/router-extension.service';
import * as EpisodeActions from '@app/modules/webtoon/store/episode/episode.actions';
import {environment} from '@environments/environment';

export const currencyChargePriceList = {
    KRW: [
        { amount: 10,   price: 1200,    bonusRate: 3 },
        { amount: 30,   price: 3600,    bonusRate: 11 },
        { amount: 50,   price: 6000,    bonusRate: 20 },
        { amount: 100,  price: 12000,   bonusRate: 37 },
        { amount: 200,  price: 24000,   bonusRate: 77 },
        { amount: 500,  price: 50000,   bonusRate: 177 },
    ],
    USD: [
        { amount: 10,   price: 1,    bonusRate: 3 },
        { amount: 30,   price: 3,    bonusRate: 11 },
        { amount: 50,   price: 5,    bonusRate: 20 },
        { amount: 100,  price: 10,   bonusRate: 37 },
        { amount: 200,  price: 20,   bonusRate: 77 },
        { amount: 500,  price: 50,   bonusRate: 177 },
    ],
    MXN: [
        { price: 1, bonusRate: 0 },
        { price: 10, bonusRate: 0 },
        { price: 20, bonusRate: 0 },
        { price: 50, bonusRate: 0 },
        { price: 100, bonusRate: 0 },
        { price: 200, bonusRate: 0 },
    ]
};

@Component({
    selector: 'app-billing',
    templateUrl: './billing.component.html',
    styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit, OnDestroy {
    public templateInfo: TemplateInfo;

    private readonly messages: any;
    public coin: any;
    public coinCharging: any;
    public activeIndex = -1;
    public selectedBillOptions = 'card';
    public isApproved = false;
    public isSavePayment = false;
    private alertCoinMessage = '';
    private alertApproveMessage = '';

    // TODO: refactor below
    public billOptions = ['card'];
    public isAuthenticated$: Observable<boolean>;

    public currency: string;
    public pleaseLoginText = '';
    public selectedTDN: any;
    exchange$: Observable<any>;
    profile$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private previousUrl = '';
    contentcoin$: number;

    constructor(public dialog: MatDialog,
                public router: Router,
                private rootStore$: Store<fromRoot.State>,
                private paymentStore$: Store<fromPayment.State>,
                private translate: TranslateService,
                private lemonAuthService: BaseService,
                private routerExtensionService: RouterExtensionService,
                private route: ActivatedRoute,
                private comicService: ComicService) {
        // TODO: use translate
        this.messages = new Map([
            [1, '결제 금액을 선택해주세요.'],
            [2, '구매 진행에 동의해주세요.'],
        ]);

        this.route.paramMap.subscribe( (paramMaps: any) => {
            console.log(paramMaps.params);
            // this.titleId = paramMaps.params.titleId;
            // const params = { titleId: this.titleId, page: 0, limit: 10, sort: this.sortType };
            // this.episodeStore$.dispatch(EpisodeActions.FetchTitleAndEpisodes({ params }));
        });
    }

    ngOnInit() {
        this.setTemplateInfo();
        this.getTranslateText();
        this.getExchangeData();

        this.previousUrl = this.routerExtensionService.getPreviousUrl();
        this.translate.get('setting.please-login').subscribe(text => this.pleaseLoginText = text);
        this.isAuthenticated$ = this.lemonAuthService.isAuthenticated$().pipe(takeUntil(this.destroyed$));
        this.profile$ = this.rootStore$.pipe(select(fromRoot.getProfile), filter(profile => {

            const userID = parseInt(localStorage.getItem('current_user'), 10);
            this.comicService.request1$('GET', environment.localUrl, '/client/payment/balance', { ...{user_id: userID} }).subscribe(data => {
                this.contentcoin$ = data['body'].data.data.balance;
            });

            return !!profile;
        }), takeUntil(this.destroyed$));
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    private getExchangeData() {
        this.exchange$ = this.translate.get('common.currency').pipe(
            tap(currency => this.currency = currency),
            switchMap(currency => this.comicService.getExchange$(currency)),
            takeUntil(this.destroyed$)
        );
        this.exchange$.subscribe(exchange => {
            const { source, target, ratio, decimal } = exchange;
            const priceList = currencyChargePriceList[source];
            this.coinCharging = priceList.map(data => {
                const { amount, price, bonusRate } = data;
                const targetCurrency = target;
                // const targetPrice = this.getTargetPrice(price, ratio || 1, decimal || 0);
                const targetPrice = amount;
                const targetBonus = bonusRate;
                return { price, targetCurrency, targetPrice, targetBonus };
            });
            this.setDefaultChargingValue();
        });
    }

    private setDefaultChargingValue() {
        const defaultIndex = 0;
        this.activeIndex = defaultIndex;
        this.coin = this.coinCharging[defaultIndex];
    }

    private getTargetPrice(sourcePrice: number, ratio: number = 1, decimal: number = 0) {
        const A = sourcePrice * ratio;
        const D = Math.pow(10, decimal);
        const total = Math.round(A * D) / D;
        return total;
    }

    openDialog(): void {
        // console.log(this);
        if (!this.isApproved) {
            this.dialog.open(BillingDialogComponent, {
                width: '300px',
                hasBackdrop: true,
                data: { messages: this.alertApproveMessage }
            });
            return;
        }

        if (this.activeIndex < 0) {
            this.dialog.open(BillingDialogComponent, {
                width: '300px',
                hasBackdrop: true,
                data: { messages: this.alertCoinMessage }
            });
            return;
        }

        this.isAuthenticated$.subscribe(isAuth => {
            if (!isAuth) {
                this.openLoginDialog();
                return;
            }

            this.paymentStore$.dispatch(PaymentActions.ResetToChargeData());
            const currentLanguage = this.translate.currentLang || this.translate.defaultLang;
            // if (currentLanguage === 'ko') {
            //     this.chargeTDNonKorea();
            //     return;
            // }
            this.chargeTDNonMexico();
        });
    }

    private chargeTDNonKorea() {
        const selectedCoinCharging = this.coinCharging[this.activeIndex];
        const { price, targetPrice, targetBonus } = selectedCoinCharging;
        const redirectPath = this.previousUrl || this.router.url;
        const bodyData: ChargeTDNBody = {
            currency: this.currency,
            amount: price,
            tdn: targetPrice + targetBonus,
            ngReturn: redirectPath,
            pgName: 'kcp',
            paymentData: {
                name: `ContentCoin 충전 (${targetPrice + targetBonus} ContentCoin)`, // Recarga
                method: 'card'
            }
        };
        this.paymentStore$.dispatch(PaymentActions.ChargeTDN({ data: bodyData }));
    }

    private chargeTDNonMexico() {
        const selectedCoinCharging = this.coinCharging[this.activeIndex];
        const { price, targetPrice, targetBonus } = selectedCoinCharging;
        const redirectPath = this.previousUrl ? `/payment/finish?redirectPath=${this.previousUrl}` : `/payment/finish`;
        const bodyData: ChargeTDNBody = {
            currency: this.currency,
            amount: price,
            tdn: targetPrice + targetBonus,
            ngReturn: encodeURI(redirectPath),
            pgName: null,
            paymentData: {
                name: `ContentCoin Recarga (${targetPrice + targetBonus} ContentCoin)`,
                method: 'card'
            }
        };

        /////

        // RxJS 라는 프레임워크와 호환 가능한 google 인앱결제 library 코드 삽입

        /////


        this.paymentStore$.dispatch(PaymentActions.SetChargeTDNData({ data: bodyData }));
        this.router.navigateByUrl('/payment/charge');
    }



    onItemClick(coinTarget: any, index: number): void {
        this.coin = coinTarget;
        this.activeIndex = index;
    }

    onBillOptionsChange(event: any) {
        const { value } = event;
        // console.log(value);
    }

    private setTemplateInfo() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 7;
        this.templateInfo.botbar = false;
        this.templateInfo.txtTitle = 'billing';
    }

    private getTranslateText() {
        this.translate.get('billing.alert.coin').subscribe(text => {
            this.alertCoinMessage = text;
        });
        this.translate.get('billing.alert.approve').subscribe(text => {
            this.alertApproveMessage = text;
        });
    }

    openLoginDialog(): void {
        const redirectPath = this.router.url;
        const loginDialogRef = this.dialog.open(LoginDialogComponent, {
            width: '400px',
            maxWidth: '90%',
            hasBackdrop: true,
            data: { redirectPath }
        });
    }

}
