import { Component, OnInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { TemplateInfo } from '@app/models/templateInfo';
import { LemonAuthService } from '@core/services/lemon-auth.service';
import { isNull } from 'util';
import { Observable, ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { GetTdnHistoryResult, TDNHistoryList } from '../../store/payment.reducer';
import * as fromPayment from '../../store/payment.reducer';
import * as PaymentActions from '../../store/payment.actions';

import { Position, ScrollService } from '@core/services/scroll.service';
import { filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import {UtilsService} from '@core/services/utils.service';
import * as EpisodeActions from '@app/modules/webtoon/store/episode/episode.actions';

@Component({
    selector: 'app-tdn-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {

    public lastScrollTop = 0;
    public templateInfo: TemplateInfo;
    private isAuth = false;

    public page$: Observable<number>;
    public total$: Observable<number>;
    public totalPage$: Observable<number>;
    public tdnHistory$: Observable<TDNHistoryList>;
    public isFetching$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    public selected = 'option1';
    public sortType = '!createdAt';

    constructor(private lemonService: LemonAuthService,
                private scrollService: ScrollService,
                private route: Router,
                private utilsService: UtilsService,
                private paymentStore$: Store<fromPayment.State>) { }

    ngOnInit() {
        this.lemonService.getAllcomicsProfile().toPromise().then(res => {
            if (res['body'].data.data.user_id > 0) {
                const params = { page: 0, limit: 10 };
                this.paymentStore$.dispatch(PaymentActions.FetchTDNHistory({ params }));
            }
        });
        this.setTemplateInfo();
        this.setupBottomBar();
        this.setupReducerListener();
        this.setupScrolledDownEventListener();
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    changeSort(option: string) {
        this.sortType = option;
        this.paymentStore$.dispatch(PaymentActions.ResetTDNHistory());
        this.getTDNHistory({ page: 0, limit: 10, sort: option });
    }

    private setupBottomBar() {
        this.scrollService.onScroll$.pipe(takeUntil(this.destroyed$)).subscribe(pos => this.showOrHideBottomBar(pos));
    }

    private showOrHideBottomBar(pos: Position) {
        const { scrollHeight, scrollTop, offsetHeight } = pos;
        const PADDING_HEIGHT = 30;
        const position = scrollTop;
        const maxScroll = scrollHeight - offsetHeight - PADDING_HEIGHT;
        const bottomBar = document.getElementById('bottom-bar');
        if (!isNull(bottomBar)) {
            (position > this.lastScrollTop) && (maxScroll - position > 0) ? bottomBar.classList.add('height0') : bottomBar.classList.remove('height0');
        }
        this.lastScrollTop = position;
    }

    private setupReducerListener() {
        this.isFetching$ = this.paymentStore$.pipe(select(fromPayment.getIsFetching), takeUntil(this.destroyed$));
        this.tdnHistory$ = this.paymentStore$.pipe(select(fromPayment.getTdnHistory), takeUntil(this.destroyed$));
        this.page$ = this.paymentStore$.pipe(select(fromPayment.getTdnHistory), map(history => history.page), takeUntil(this.destroyed$));
        this.total$ = this.paymentStore$.pipe(select(fromPayment.getTdnHistory), map(history => history.total), takeUntil(this.destroyed$));
        this.totalPage$ = this.paymentStore$.pipe(select(fromPayment.getTdnHistory), map(history => history.totalPage), takeUntil(this.destroyed$));
    }

    private setupScrolledDownEventListener() {
        const shouldFetch$ = this.scrollService.onScrolledDown$.pipe(
            withLatestFrom(this.isFetching$, this.page$, this.totalPage$),
            filter(([positions, isFetching, page, totalPage]) => !!!isFetching),
            filter(([positions, isFetching, page, totalPage]) => page + 1 <= totalPage),
            map(([positions, isFetching, page, totalPage]) => page),
            takeUntil(this.destroyed$)
        );
        shouldFetch$.subscribe(page => this.getTDNHistory({ page: page + 1, limit: 10 }));
    }

    private getTDNHistory(params: any = {}) {
        this.paymentStore$.dispatch(PaymentActions.FetchTDNHistory({ params }));
    }

    private setTemplateInfo() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 7;
        this.templateInfo.botbar = false;
        this.templateInfo.txtTitle = 'history';
    }
}
