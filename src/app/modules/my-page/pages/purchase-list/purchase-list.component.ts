import { Component, OnDestroy, OnInit } from '@angular/core';

import { LemonAuthService } from '@core/services/lemon-auth.service';
import { ComicService } from '@core/services/comic.service';

import { TemplateInfo } from '@app/models/templateInfo';
import { Title } from '@app/models/title';
import { isNull } from 'util';
import {Observable, ReplaySubject} from 'rxjs';
import { PurchasedList} from '@app/modules/my-page/store/my-page.reducer';
import * as MyPageActions from '@app/modules/my-page/store/my-page.actions';
import {select, Store} from '@ngrx/store';
import * as fromMyPage from '@app/modules/my-page/store/my-page.reducer';
import {Position, ScrollService} from '@core/services/scroll.service';
import {Router} from '@angular/router';
import {filter, map, takeUntil, withLatestFrom} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-purchase-list',
    templateUrl: './purchase-list.component.html',
    styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent implements OnInit, OnDestroy {

    public lastScrollTop = 0;
    public templateInfo: TemplateInfo;

    isShow = true;
    orders: Title[];
    public orderOptions = ['asc', 'desc'];
    // public orderOptions = ['updated', 'popular', 'name'];
    public selected = 'desc';

    public page$: Observable<number>;
    public totalPage$: Observable<number>;
    public purchased$: Observable<PurchasedList>;
    public isFetching$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    private dict_buy_type = {
        ko: {
            buy: '소장중',
            rent: '대여중'
        },
        en: {
            buy: 'buy',
            rent: 'rent'
        },
        es: {
            buy: 'buy',
            rent: 'rent'
        },
        id: {
            buy: 'buy',
            rent: 'rent'
        }
    };

    constructor(private lemonService: LemonAuthService,
                private myPageStore$: Store<fromMyPage.State>,
                private scrollService: ScrollService,
                private translate: TranslateService,
                private route: Router) { }

    ngOnInit() {
        this.lemonService.isAllcomicsAuth().toPromise().then(isAuth => {
            if (isAuth['body'].data.data.isValid) {
                const params = { page: 1, limit: 12, sort: this.selected };
                this.myPageStore$.dispatch(MyPageActions.FetchPurchased({params}));
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

    onShowDetail(id: string) {
        this.route.navigateByUrl('/webtoon/detail/' + id);
    }

    private setupScrolledDownEventListener() {
        const shouldFetch$ = this.scrollService.onScrolledDown$.pipe(
            withLatestFrom(this.isFetching$, this.page$, this.totalPage$),
            filter(([positions, isFetching, page, totalPage]) => !!!isFetching),
            filter(([positions, isFetching, page, totalPage]) => page + 1 <= totalPage),
            map(([positions, isFetching, page, totalPage]) => page),
            takeUntil(this.destroyed$)
        );
        shouldFetch$.subscribe(page => {
            const params = { page: page + 1, limit: 12, sort: this.selected };
            this.myPageStore$.dispatch(MyPageActions.FetchPurchased({ params }));
        });
    }

    private setupReducerListener() {
        this.isFetching$ = this.myPageStore$.pipe(select(fromMyPage.getIsFetching), takeUntil(this.destroyed$));
        this.purchased$ = this.myPageStore$.pipe(select(fromMyPage.getPurchased), takeUntil(this.destroyed$));
        this.page$ = this.myPageStore$.pipe(select(fromMyPage.getPurchased), map(purchased => purchased.page), takeUntil(this.destroyed$));
        this.totalPage$ = this.myPageStore$.pipe(select(fromMyPage.getPurchased), map(purchased => purchased.totalPage), takeUntil(this.destroyed$));
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

    toggleDisplay() {
        this.isShow = !this.isShow;
    }

    onClickedOutside(e: Event) {
        this.isShow = true;
    }

    onChange(event: any) {
        const { value } = event;
        const params = { page: 1, limit: 12, sort: value };
        this.myPageStore$.dispatch(MyPageActions.ResetPurchased());
        this.myPageStore$.dispatch(MyPageActions.FetchPurchased({ params }));
    }

    private setTemplateInfo() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 3;
        this.templateInfo.botbar = false;
        this.templateInfo.txtTitle = 'purchase';
    }

    buyType(type) {
        return this.dict_buy_type[this.getCurrentLanguage()][type];
    }

    getCurrentLanguage(): string {
        return this.translate.currentLang || this.translate.defaultLang || 'ko';
    }
}
