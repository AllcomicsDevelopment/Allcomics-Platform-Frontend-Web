import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatTabGroup } from '@angular/material';

import { ComicService } from '@core/services/comic.service';
import { ScrollService, Position } from '@core/services/scroll.service';
import { LoaderService } from '@core/services/loader.service';

import { TemplateInfo } from '@app/models/templateInfo';
import { Title } from '@app/models/title';

import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';

import * as fromWebtoon from '../../store/webtoon/webtoon.reducer';
import * as WebtoonActions from '../../store/webtoon/webtoon.actions';
import { distinctUntilChanged, withLatestFrom, takeUntil, filter, map } from 'rxjs/operators';
import { isNull } from 'util';
import { Banner } from '@app/models/banner';
import {environment} from '@environments/environment';
import {type} from 'os';

@Component({
    selector: 'app-genre-by-webtoon',
    templateUrl: './genre-by-webtoon.component.html',
    styleUrls: ['./genre-by-webtoon.component.scss']
})
export class GenreByWebtoonComponent implements OnInit, OnDestroy {

    public lastScrollTop = 0;
    public templateInfo: TemplateInfo;
    public tabsPhoto: any;

    // tab Info
    public tabs: { genre: string, name: string }[];
    public readonly genres = ['romance', 'drama', 'action', 'fantasy', 'blgl', 'manga', 'challenges'];
    public selectedIndex = 0;
    public idx = 0;

    @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
    private swipeCoord?: [number, number];
    private swipeTime?: number;

    public page$: Observable<number>;
    private total$: Observable<number>;
    public totalPage$: Observable<number>;
    private isInit$: Observable<boolean>;
    public webtoonList$: Observable<Title[]>;
    public banner$: Observable<Banner>;
    public banner: Banner;
    private activeGenre$: Observable<string>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private bannerList$: Observable<any>;

    public isFetching$: Observable<boolean>;
    private activeGenre = 'romance';

    private contentID: string;

    constructor(private comicService: ComicService,
                private translate: TranslateService,
                private router: Router,
                private route: ActivatedRoute,
                private webtoonStore$: Store<fromWebtoon.State>,
                private scrollService: ScrollService,
                private loaderService: LoaderService) {
        this.route.paramMap.subscribe( (paramMaps: any) => {
            this.contentID = paramMaps.params.contentId;
        });
    }

    ngOnInit() {
        this.webtoonStore$.dispatch(WebtoonActions.SetActiveGenre({ genre: 'romance' }));
        // this.webtoonStore$.dispatch(WebtoonActions.FetchGenresBannerList({ params: {}, category: 'genre' }));

        this.setTemplateInfo();
        this.initTabsInfo();

        this.setupReducerListener();
        this.setupInitData();
        // this.setupBottomBar();
        // this.setupScrolledDownEventListener();
        // this.setupBannerListener();
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    swipe(e: any, when: any): void {
        const coord: [any, any] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
        const time = new Date().getTime();

        if (when === 'start') {
            this.swipeCoord = coord;
            this.swipeTime = time;
        } else if (when === 'end') {
            const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
            const duration = time - this.swipeTime;

            if (duration < 1000 //
                && Math.abs(direction[0]) > 30 // Long enough
                && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
                const swipe = direction[0] < 0 ? 'next' : 'previous';
                switch (swipe) {
                    case 'previous':
                        if (this.selectedIndex > 0) { this.selectedIndex--; }
                        break;
                    case 'next':
                        if (this.selectedIndex < this.tabGroup._tabs.length - 1) { this.selectedIndex++; }
                        break;
                }
            }
        }
    }

    changeTab(tabInfo: any) {
        const { index } = tabInfo;
        const activeTab = this.tabs[index];
        const { genre } = activeTab;
        this.webtoonStore$.dispatch(WebtoonActions.SetActiveGenre({ genre }));
    }

    onDetail(id: string) {
        if (this.contentID === 'webtoon') {
            this.router.navigateByUrl('/webtoon/detail/' + id);
        } else {
            this.router.navigateByUrl('/novel/detail/' + id);
        }
    }

    onClickBanner(link: string) {
        this.router.navigateByUrl(link);
    }

    private setTemplateInfo() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 10;
        this.templateInfo.botbar = true;
        this.templateInfo.txtTitle = 'webtoon';
    }

    private initTabsInfo() {
        this.tabs = this.genres.map(genre => ({ genre, name: `common.genre.${genre}` }));

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
        this.total$ = this.webtoonStore$.pipe(select(fromWebtoon.getActiveWebtoonTotal), takeUntil(this.destroyed$));
        this.page$ = this.webtoonStore$.pipe(select(fromWebtoon.getActiveWebtoonPage), takeUntil(this.destroyed$));
        this.totalPage$ = this.webtoonStore$.pipe(select(fromWebtoon.getActiveWebtoonTotalPage), takeUntil(this.destroyed$));
        this.isInit$ = this.webtoonStore$.pipe(select(fromWebtoon.getActiveWebtoonIsInit), takeUntil(this.destroyed$));
        this.webtoonList$ = this.webtoonStore$.pipe(select(fromWebtoon.getActiveWebtoonList), takeUntil(this.destroyed$));
        this.activeGenre$ = this.webtoonStore$.pipe(select(fromWebtoon.getActiveGenre), distinctUntilChanged(), takeUntil(this.destroyed$));
        this.isFetching$ = this.webtoonStore$.pipe(select(fromWebtoon.getIsFetching), takeUntil(this.destroyed$));
    }

    private setupBannerListener() {
        // STEP1. banner list 불러옴
        this.bannerList$ = this.webtoonStore$.pipe(select(fromWebtoon.getBannerList), filter(banners => !!banners), takeUntil(this.destroyed$));
        // STEP2. banner list에서 현재 category, subCategory의 banner 데이터 가져오기
        this.banner$ = this.webtoonStore$.pipe(select(fromWebtoon.getActiveWebtoonBanner), filter(banner => !!banner), takeUntil(this.destroyed$));
        this.banner$.subscribe(banner => this.banner = banner);

        // check should fetch banner
        const initDefaultBanner$ = this.bannerList$.pipe(withLatestFrom(this.activeGenre$), takeUntil(this.destroyed$));
        initDefaultBanner$.subscribe(([banners, genre]) => this.fetchActiveBanner(genre, banners));

        const shouldFetchBanner$ = this.activeGenre$.pipe(
            withLatestFrom(this.isInit$, this.bannerList$),
            filter(([_, isInit, banners]) => !!!isInit),
            map(([genre, isInit, banners]) => ({ genre, banners })),
            takeUntil(this.destroyed$)
        );
        shouldFetchBanner$.subscribe(({ genre, banners }) => this.fetchActiveBanner(genre, banners));
    }

    private fetchActiveBanner(genre: string, banners: any[]) {
        const currentActiveGenreBannerId = banners.filter(banner => banner.category === 'genre' && banner.subCategory === genre).map(banner => banner.id)[0];
        if (!currentActiveGenreBannerId) {
            return;
        }
        this.webtoonStore$.dispatch(WebtoonActions.FetchActiveGenreBanner({ bannerId: currentActiveGenreBannerId }));
    }

    private setupInitData() {
        const shouldInit$ = this.activeGenre$.pipe(
            withLatestFrom(this.isInit$),
            filter(([_, isInit]) => !!!isInit),
            map(([genre, isInit]) => genre),
            takeUntil(this.destroyed$)
        );
        shouldInit$.subscribe(genre => this.getTitles({ genre, page: 0, count: 10, language: this.getCurrentLanguage() }));
    }

    private setupScrolledDownEventListener() {
        const shouldFetch$ = this.scrollService.onScrolledDown$.pipe(
            withLatestFrom(this.isFetching$, this.page$, this.totalPage$),
            filter(([positions, isFetching, page, totalPage]) => !!!isFetching),
            filter(([positions, isFetching, page, totalPage]) => page + 1 <= totalPage),
            map(([positions, isFetching, page, totalPage]) => page),
            takeUntil(this.destroyed$)
        );
        shouldFetch$.subscribe(page => this.getTitles({ genre: this.activeGenre, page: page + 1, limit: 10, language: this.getCurrentLanguage() }));
    }

    private getTitles(params: any = {}) {
        params['content'] = this.contentID;
        this.webtoonStore$.dispatch(WebtoonActions.FetchWebtoonList({ params }));
    }

    getCurrentLanguage() {
        return this.translate.currentLang || this.translate.defaultLang || environment.language;
    }

}
