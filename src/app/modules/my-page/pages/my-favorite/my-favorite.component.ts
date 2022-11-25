import { Component, OnInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { TemplateInfo } from '@app/models/templateInfo';
import { LemonAuthService } from '@core/services/lemon-auth.service';
import { isNull } from 'util';
import { Observable, ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';

import * as fromMyPage from '../../store/my-page.reducer';
import * as MyPageActions from '../../store/my-page.actions';

import { Position, ScrollService } from '@core/services/scroll.service';
import { filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { FavoriteList } from '../../store/my-page.reducer';
import { Router } from '@angular/router';

@Component({
    selector: 'app-my-favorite',
    templateUrl: './my-favorite.component.html',
    styleUrls: ['./my-favorite.component.scss']
})
export class MyFavoriteComponent implements OnInit, OnDestroy {

    public lastScrollTop = 0;
    public templateInfo: TemplateInfo;

    @ViewChildren('.comic-item') comic_items: QueryList<any>;
    private isAuth = false;

    public page$: Observable<number>;
    public totalPage$: Observable<number>;
    public favorites$: Observable<FavoriteList>;
    public isFetching$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private lemonService: LemonAuthService,
                private scrollService: ScrollService,
                private route: Router,
                private myPageStore$: Store<fromMyPage.State>) { }

    ngOnInit() {
        this.lemonService.isAuthenticated().then(isAuth => {
            this.isAuth = isAuth;
            if (isAuth) {
                const params = { page: 1, limit: 12 };
                this.myPageStore$.dispatch(MyPageActions.FetchFavorites({ params }));
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
        this.isFetching$ = this.myPageStore$.pipe(select(fromMyPage.getIsFetching), takeUntil(this.destroyed$));
        this.favorites$ = this.myPageStore$.pipe(select(fromMyPage.getFavorites), takeUntil(this.destroyed$));
        this.page$ = this.myPageStore$.pipe(select(fromMyPage.getFavorites), map(favorites => favorites.page), takeUntil(this.destroyed$));
        this.totalPage$ = this.myPageStore$.pipe(select(fromMyPage.getFavorites), map(favorites => favorites.totalPage), takeUntil(this.destroyed$));
    }

    private setupScrolledDownEventListener() {
        const shouldFetch$ = this.scrollService.onScrolledDown$.pipe(
            withLatestFrom(this.isFetching$, this.page$, this.totalPage$),
            filter(([positions, isFetching, page, totalPage]) => !!!isFetching),
            filter(([positions, isFetching, page, totalPage]) => page + 1 <= totalPage),
            map(([positions, isFetching, page, totalPage]) => page),
            takeUntil(this.destroyed$)
        );
        shouldFetch$.subscribe(page => this.getFavorites({ page: page + 1, limit: 12 }));
    }

    private getFavorites(params: any = {}) {
        this.myPageStore$.dispatch(MyPageActions.FetchFavorites({ params }));
    }

    private setTemplateInfo() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 2;
        this.templateInfo.botbar = true;
        this.templateInfo.txtTitle = 'myfavorite';
        this.templateInfo.txtRight = 'delete';
    }

    filterLike(event) {
        this.comic_items.forEach(item => item.nativeElement.children[0].classList = ['isLike']);
        event.target.classList.add('active');
    }
}
