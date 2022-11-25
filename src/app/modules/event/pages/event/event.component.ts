import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { TemplateInfo } from '@app/models/templateInfo';

import { ComicService } from '@core/services/comic.service';
import { LemonAuthService } from '@core/services/lemon-auth.service';
import { EventService } from '@core/services/event.service';
import { LoaderService } from '@core/services/loader.service';

import { environment } from '@environments/environment';
import { isNull } from 'util';

import { Title } from '@app/models/title';

import { Observable, ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { filter, map, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

import * as fromRoot from '../../../../store/root/root.reducer';
import * as RootActions from '../../../../store/root/root.actions';

import * as fromEvent from '../../store/event.reducer';
import * as EventActions from '../../store/event.actions';
import { Banner } from '@app/models/banner';

export interface UserInfo {
    profile: any;
    account: any;
}

@Component({
    selector: 'app-event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit, OnDestroy {

    public lastScrollTop = 0;
    public config: SwiperConfigInterface = {};
    public templateInfo: TemplateInfo;

    ranking$: Observable<Title[]>;
    populars$: Observable<Title[]>;
    completed$: Observable<Title[]>;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    public bannerList$: Observable<Banner[]>;
    public eventMainBanner$: Observable<Banner>;
    public eventInfoBanner$: Observable<Banner>;
    public eventFreeBanner$: Observable<Banner>;
    public isProduction = false;
    public tabs = [
        { title: '30% 할인' },
        { title: '50% 할인' },
    ];
    public tempTitle = '기간 한정 10화 무료';

    constructor(private eventService: EventService,
                private comicService: ComicService,
                private authService: LemonAuthService,
                private loaderService: LoaderService,
                private translate: TranslateService,
                private route: Router,
                private rootStore$: Store<fromRoot.State>,
                private eventStore$: Store<fromEvent.State>) {
        this.isProduction = environment.production;
    }

    ngOnInit() {
        window.addEventListener('scroll', this.scroll, true);
        this.setupTemplateInfo();
        this.setupBannerListener();
        this.setupTitleListener();
    }

    ngOnDestroy() {
        window.removeEventListener('scroll', this.scroll, true);
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    scroll(event: any) {
        const position = event.target.scrollTop;
        const maxScroll = event.target.scrollHeight - event.target.offsetHeight;
        const bottomBar = document.getElementById('bottom-bar');
        if (!isNull(bottomBar)) {
            (position > this.lastScrollTop) && (maxScroll - position > 0) ? bottomBar.classList.add('height0') : bottomBar.classList.remove('height0');
        }
        this.lastScrollTop = position;
    }

    private setupTitleListener() {
        this.ranking$ = this.eventStore$.pipe(select(fromEvent.getRankings), filter(title => !!title), takeUntil(this.destroyed$));
        this.populars$ = this.eventStore$.pipe(select(fromEvent.getPopulars), filter(title => !!title), takeUntil(this.destroyed$));
        this.completed$ = this.eventStore$.pipe(select(fromEvent.getCompleted), filter(title => !!title), takeUntil(this.destroyed$));

        const shouldFetchRankings$ = this.eventStore$.pipe(select(fromEvent.getRankings), filter(title => !!!title), take(1), takeUntil(this.destroyed$));
        shouldFetchRankings$.subscribe(() => this.getRankings());

        const shouldFetchPopulars$ = this.eventStore$.pipe(select(fromEvent.getPopulars), filter(title => !!!title), take(1), takeUntil(this.destroyed$));
        shouldFetchPopulars$.subscribe(() => this.getPopular());

        const shouldFetchCompleted$ = this.eventStore$.pipe(select(fromEvent.getCompleted), filter(title => !!!title), take(1), takeUntil(this.destroyed$));
        shouldFetchCompleted$.subscribe(() => this.getCompleted());
    }

    private setupBannerListener() {
        /*this.bannerList$ = this.eventStore$.pipe(select(fromEvent.getEventBanners), filter(banners => !!banners), takeUntil(this.destroyed$));
        this.eventMainBanner$ = this.eventStore$.pipe(select(fromEvent.getEventMainBanner), filter(banner => !!banner), takeUntil(this.destroyed$));
        this.eventInfoBanner$ = this.eventStore$.pipe(select(fromEvent.getEventInfoBanner), filter(banner => !!banner), takeUntil(this.destroyed$));
        this.eventFreeBanner$ = this.eventStore$.pipe(select(fromEvent.getEventFreeBanner), filter(banner => !!banner), takeUntil(this.destroyed$));

        const shouldFetchBannerList$ = this.eventStore$.pipe(select(fromEvent.getEventBanners), filter(banners => !!!banners), take(1), takeUntil(this.destroyed$));
        shouldFetchBannerList$.subscribe(() => {
            const params = {};
            const category = 'event';
            this.eventStore$.dispatch(EventActions.FetchBannerList({ params, category }));
        });

        const shouldFetchEventMainBanner$ = this.bannerList$.pipe(
            // map(banners => banners.filter(banner => banner.category === 'event' && banner.subCategory === 'event-main')),
            filter(banners => !!banners),
            filter(banners => banners.length > 0),
            // map(banners => banners[0].id), // get slideBannerId
            withLatestFrom(this.eventStore$.pipe(select(fromEvent.getEventMainBanner))),
            filter(([bannerId, banner]) => !!!banner),
            map(([bannerId, banner]) => bannerId),
            takeUntil(this.destroyed$)
        );
        shouldFetchEventMainBanner$.subscribe(eventMainBannerId => this.eventStore$.dispatch(EventActions.FetchEventMainBanner({ eventMainBannerId })));

        const shouldFetchEventInfoBanner$ = this.bannerList$.pipe(
            // map(banners => banners.filter(banner => banner.category === 'event' && banner.subCategory === 'event-info')),
            filter(banners => !!banners),
            filter(banners => banners.length > 0),
            // map(banners => banners[0].id),
            withLatestFrom(this.eventStore$.pipe(select(fromEvent.getEventInfoBanner))),
            filter(([bannerId, banner]) => !!!banner),
            map(([bannerId, banner]) => bannerId),
            takeUntil(this.destroyed$)
        );
        shouldFetchEventInfoBanner$.subscribe(eventInfoBannerId => this.eventStore$.dispatch(EventActions.FetchEventInfoBanner({ eventInfoBannerId })));

        const shouldFetchEventFreeBanner$ = this.bannerList$.pipe(
            // map(banners => banners.filter(banner => banner.category === 'event' && banner.subCategory === 'event-free')),
            filter(banners => !!banners),
            filter(banners => banners.length > 0),
            map(banners => banners[0].id),
            withLatestFrom(this.eventStore$.pipe(select(fromEvent.getEventFreeBanner))),
            filter(([bannerId, banner]) => !!!banner),
            map(([bannerId, banner]) => bannerId),
            takeUntil(this.destroyed$)
        );
        shouldFetchEventFreeBanner$.subscribe(eventFreeBannerId => this.eventStore$.dispatch(EventActions.FetchEventFreeBanner({ eventFreeBannerId })));*/
    }

    private setupTemplateInfo() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 4;
        this.templateInfo.botbar = true;
        this.templateInfo.txtTitle = 'event';
    }

    getRankings() {
        const params = { limit: 5, page: 0, sort: 'total_views', order: 'desc' };
        this.eventStore$.dispatch(EventActions.FetchRankings({ params }));
    }

    getPopular() {
        const params = { keyword: 'rec' };
        this.eventStore$.dispatch(EventActions.FetchPopulars({ params }));
    }

    getCompleted() {
        const params = { keyword: 'tofree' };
        this.eventStore$.dispatch(EventActions.FetchCompleted({ params }));
    }

    onClickBannerItem(link: string) {
        this.route.navigateByUrl(link);
    }

    clickEventMainBanner() {
        const bannerLink = this.eventMainBanner$.pipe(
            // map(banner => banner.items[0].redirect_url),
            takeUntil(this.destroyed$)
        );
        // bannerLink.subscribe(link => this.route.navigateByUrl(link));
    }

    clickEventInfoBanner() {
        const bannerLink = this.eventInfoBanner$.pipe(
            // map(banner => banner.items[0].redirect_url),
            takeUntil(this.destroyed$)
        );
        // bannerLink.subscribe(link => this.route.navigateByUrl(link));
    }

    clickEventFreeBanner() {
        const bannerLink = this.eventFreeBanner$.pipe(
            // map(banner => banner.items[0].redirect_url),
            takeUntil(this.destroyed$)
        );
        // bannerLink.subscribe(link => this.route.navigateByUrl(link));
    }


    onShowDetail(id: string) {
        this.route.navigateByUrl('/webtoon/detail/' + id);
    }

    getBadgeColor(badge: string) {
        const badgeColors = {
            discount: 'red',
            updated: 'pir',
            recommended: 'yellow',
            completed: 'blue',
        };
        return badgeColors[badge] || 'red';
    }

    getTranslateGenre(genres: any) {
        return genres ? genres.map(genre => this.translate.instant(`common.genre.${genre}`)) : [];
    }

}
