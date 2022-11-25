import {Component, OnInit, AfterViewInit, OnDestroy, ViewChild} from '@angular/core';
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

import {Observable, of, ReplaySubject, zip} from 'rxjs';
import { select, Store } from '@ngrx/store';
import {distinctUntilChanged, filter, first, map, switchMap, take, takeUntil, tap, withLatestFrom} from 'rxjs/operators';

import * as fromRoot from '../../../../store/root/root.reducer';

import * as fromHome from '../../store/home.reducer';
import * as HomeActions from '../../store/home.actions';
import { Banner } from '@app/models/banner';
import {MatTabGroup} from '@angular/material';
import * as moment from 'moment';

export interface UserInfo {
    profile: any;
    account: any;
}

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {

    public lastScrollTop = 0;
    public config: SwiperConfigInterface = {};
    public customConfig: SwiperConfigInterface = {};
    public config2: SwiperConfigInterface = {};
    public config3: SwiperConfigInterface = {};
    public config4: SwiperConfigInterface = {};
    public templateInfo: TemplateInfo;
    public isToggle: boolean;

    weeks$: Observable<Title[]>;
    ranking$: Observable<Title[]>;
    populars$: Observable<Title[]>;
    recentlyUpdated$: Observable<Title[]>;
    romance$: Observable<Title[]>;
    boysLove$: Observable<Title[]>;
    completed$: Observable<Title[]>;

    private profile$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    public bannerList$: Observable<Banner[]>;
    public slideBanner$: Observable<Banner>;
    public bottomAdsBanner$: Observable<Banner>;
    public goodsBanner$: Observable<Banner>;
    public myPageBanner$: Observable<Banner>;
    private isInit$: Observable<boolean>;
    private activeDay$: Observable<string>;

    public isProduction = false;

    // week comic
    // tab Info
    public tabs: { day: string, name: string }[];
    public readonly weeks = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'com'];
    public readonly weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    public selectedIndex = 0;
    public idx = 0;
    @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
    private swipeCoord?: [number, number];
    private swipeTime?: number;

    constructor(private eventService: EventService,
                private comicService: ComicService,
                private authService: LemonAuthService,
                private loaderService: LoaderService,
                private translate: TranslateService,
                private route: Router,
                private rootStore$: Store<fromRoot.State>,
                private homeStore$: Store<fromHome.State>) {
        this.isProduction = environment.production;
        this.isToggle = false;
    }

    ngOnInit() {
        window.addEventListener('scroll', this.scroll, true);
        this.setupTemplateInfo();
        // this.setupProfileListener();
        this.setupBannerListener();
        this.setupTitleListener();
        //
        this.initTabsInfo();
        this.setupInitData();
    }

    ngOnDestroy() {
        window.removeEventListener('scroll', this.scroll, true);
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    ngAfterViewInit() {
        this.setSwiperConfig();
    }

    private initTabsInfo() {
        this.tabs = this.weeks.map(day => ({ day, name: `common.week.${day}` }));
    }

    private setupInitData() {
        // 현재 요일 구하기 및 탭 변경
        const weekday = this.weekdays[moment().weekday()];
        this.selectedIndex = this.weeks.findIndex(item => item === weekday);
        this.homeStore$.dispatch(HomeActions.SetActiveDay({day: weekday}));

        const shouldInit$ = this.activeDay$.pipe(
            // withLatestFrom(this.isInit$),
            // filter(([_, isInit]) => !!!isInit),
            // map(([day, isInit]) => day),
            takeUntil(this.destroyed$)
        );
        shouldInit$.subscribe((day) => {
            this.getWeeks(day);
            this.getRankings();
            this.getCompleted();
            this.getPopular();
            this.getRecentlyUpdated();
            this.getRomance();
        });
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
        const { day } = activeTab;

        this.homeStore$.dispatch(HomeActions.SetActiveDay({ day }));
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
        this.weeks$ = this.homeStore$.pipe(select(fromHome.getWeeks), filter(title => !!title), takeUntil(this.destroyed$));
        this.ranking$ = this.homeStore$.pipe(select(fromHome.getRankings), filter(title => !!title), takeUntil(this.destroyed$));
        this.completed$ = this.homeStore$.pipe(select(fromHome.getCompleted), filter(title => !!title), takeUntil(this.destroyed$));
        this.populars$ = this.homeStore$.pipe(select(fromHome.getPopulars), filter(title => !!title), takeUntil(this.destroyed$));
        this.recentlyUpdated$ = this.homeStore$.pipe(select(fromHome.getRecentlyUpdated), filter(title => !!title), takeUntil(this.destroyed$));
        this.romance$ = this.homeStore$.pipe(select(fromHome.getRomance), filter(title => !!title), takeUntil(this.destroyed$));

        // this.isInit$ = this.homeStore$.pipe(select(fromHome.getActiveWebtoonIsInit), takeUntil(this.destroyed$));
        this.activeDay$ = this.homeStore$.pipe(select(fromHome.getActiveDay), distinctUntilChanged(), takeUntil(this.destroyed$));

        // const shouldFetchWeeks$ = this.homeStore$.pipe(select(fromHome.getWeeks), filter(title => !!!title), take(1), takeUntil(this.destroyed$));
        // shouldFetchWeeks$.subscribe(() => this.getWeeks());

        const shouldFetchRankings$ = this.homeStore$.pipe(select(fromHome.getRankings), filter(title => !!!title), take(1), takeUntil(this.destroyed$));
        shouldFetchRankings$.subscribe(() => this.getRankings());

        const shouldFetchCompleted$ = this.homeStore$.pipe(select(fromHome.getCompleted), filter(title => !!!title), take(1), takeUntil(this.destroyed$));
        shouldFetchCompleted$.subscribe(() => this.getCompleted());

        const shouldFetchPopulars$ = this.homeStore$.pipe(select(fromHome.getPopulars), filter(title => !!!title), take(1), takeUntil(this.destroyed$));
        shouldFetchPopulars$.subscribe(() => this.getPopular());

        const shouldFetchRecentlyUpdated$ = this.homeStore$.pipe(select(fromHome.getRecentlyUpdated), filter(title => !!!title), take(1), takeUntil(this.destroyed$));
        shouldFetchRecentlyUpdated$.subscribe(() => this.getRecentlyUpdated());

        const shouldFetchRomance$ = this.homeStore$.pipe(select(fromHome.getRomance), filter(title => !!!title), take(1), takeUntil(this.destroyed$));
        shouldFetchRomance$.subscribe(() => this.getRomance());
    }

    private setupBannerListener() {
        this.slideBanner$ = this.homeStore$.pipe(select(fromHome.getSlideBanner), filter(banner => !!banner), takeUntil(this.destroyed$));

        this.slideBanner$.subscribe(banner => {
            if (banner.hasOwnProperty('list')) {
                const { list } = banner;
                // const slideSpeed = items[0].slideSpeed;
                const slideSpeed = 3000;
                this.config = {
                    a11y: true,
                    direction: 'horizontal',
                    slidesPerView: 1,
                    keyboard: true,
                    mousewheel: true,
                    scrollbar: false,
                    navigation: false,
                    pagination: true,
                    lazy: true,
                    autoplay: {
                        delay: slideSpeed
                    }
                };
            }
        });

        const shouldFetchBannerList$ = this.homeStore$.pipe(select(fromHome.getBanners), filter(banners => !!!banners), take(1), takeUntil(this.destroyed$));
        shouldFetchBannerList$.subscribe(() => {
            const params = {
                count: '5',
                category: 'general',
                page: 1
            };
            this.homeStore$.dispatch(HomeActions.FetchBannerList({ params }));
        });
    }

    private setupProfileListener() {
        this.profile$ = this.rootStore$.pipe(select(fromRoot.getProfile));
        this.profile$.subscribe(profile => {
            if (profile) {
                return;
            }
            this.loadAuthInfo();
        });
    }

    private loadAuthInfo() {
        this.loaderService.show();
        const isNotAuthenticated$ = this.authService.isAuthenticated$().pipe(
            filter(isAuth => !isAuth),
            takeUntil(this.destroyed$)
        );
        isNotAuthenticated$.subscribe(() => this.loaderService.hide());

        const getAuthenticatedAccount$ = this.authService.isAuthenticated$().pipe(
            filter(isAuth => isAuth),
            switchMap(() => this.authService.getCredentials$()),
            switchMap(() => this.authService.getUserProfile$()),
            take(1),
            takeUntil(this.destroyed$)
        );
        getAuthenticatedAccount$.subscribe(profile => {
            this.eventService.emit('logged', true);
            // Get Device info
            this.postDeviceInfo(profile);
            this.loaderService.hide();
        }, err => {
            this.loaderService.hide();
            // console.log(err);
        });
    }

    private setupTemplateInfo() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 1;
        this.templateInfo.botbar = true;
        this.templateInfo.txtTitle = 'login';
    }

    toggleSidebar() {
        this.eventService.emit('toggleSidebar', true);
    }

    getWeeks(day: string) {
        const params = { days: [day], limit: 30, page: 0, language: this.getCurrentLanguage() };
        // 탭 변경전 데이터 초기화
        this.homeStore$.dispatch(HomeActions.SetWeeks({weeks: []}));
        // 데이터 조회
        this.homeStore$.dispatch(HomeActions.FetchWeeks({ params }));
    }

    getRankings() {
        const params = { limit: 10, page: 0, sort: 'total_views', order: 'desc', language: this.getCurrentLanguage() };
        this.homeStore$.dispatch(HomeActions.FetchRankings({ params }));
    }

    // Today's Free
    getCompleted() {
        const params = { keyword: 'tofree', count: 30, language: this.getCurrentLanguage() };
        this.homeStore$.dispatch(HomeActions.FetchCompleted({ params }));
    }

    // popular webtoon
    getPopular() {
        const params = { keyword: 'rec', count: 30, language: this.getCurrentLanguage() };
        this.homeStore$.dispatch(HomeActions.FetchPopulars({ params }));
    }

    getRecentlyUpdated() {
        const params = {  keyword: 'new', count: 30, language: this.getCurrentLanguage() };
        this.homeStore$.dispatch(HomeActions.FetchRecentlyUpdated({ params }));
    }

    getRomance() {
        const params = { keyword: 'challenges', count: 30, language: this.getCurrentLanguage() };
        this.homeStore$.dispatch(HomeActions.FetchRomance({ params }));
    }

    getBoysLove() {
        const params = { page: 0, limit: 30, language: this.getCurrentLanguage() };
        this.homeStore$.dispatch(HomeActions.FetchBoysLove({ params }));
    }



    postDeviceInfo(user: UserInfo) {
        const deviceInfo$ = this.rootStore$.pipe(
            select(fromRoot.getDeviceInfo),
            filter(info => !!info),
            takeUntil(this.destroyed$)
        );
        deviceInfo$.subscribe(profile => {
            const { platform, deviceToken: newToken } = profile;

            const originToken = profile.deviceToken || '';
            if (originToken !== newToken) {
                // TODO: diff origin deviceToken from user info
                this.authService.getCredentials()
                    .then(() => this.authService.request('POST', environment.oauthAPI, '/user/0/device-token', {}, { token: newToken, platform }))
                    .then(res => {
                        // console.log('res: ', res);
                    });
            }
        });
    }

    getCurrentLanguage() {
        const lang = this.translate.currentLang || this.translate.defaultLang || environment.language;
        return lang;
    }

    onToggleInformation() {
        this.isToggle = !this.isToggle;
    }

    onClickSlideItem(link: string) {
        console.log('KSL', 'link', link);
        // this.route.navigateByUrl(link);
        window.location.replace(link);
    }

    onClickPolicyItem(link: string) {
        this.route.navigateByUrl(`/home/${link}`);
    }

    onShowDetail(id: string) {
        this.route.navigateByUrl('/webtoon/detail/' + id);
    }

    getTranslateGenre(genres: any) {
        return genres ? genres.map(genre => this.translate.instant(`common.genre.${genre}`)) : [];
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

    private setSwiperConfig() {
        this.config = {
            a11y: true,
            direction: 'horizontal',
            slidesPerView: 1,
            observer: true,
            keyboard: true,
            mousewheel: false,
            scrollbar: false,
            navigation: false,
            pagination: true,
            lazy: true,
            autoplay: {
                delay: 6000
            }
        };

        this.customConfig = {
            a11y: true,
            direction: 'horizontal',
            slidesPerView: 'auto',
            observer: true,
            keyboard: true,
            mousewheel: false,
            scrollbar: false,
            navigation: false,
            pagination: false,
            slidesOffsetAfter: 0,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            }
        };

        this.config2 = {
            a11y: true,
            direction: 'horizontal',
            slidesPerView: 2,
            observer: true,
            keyboard: true,
            mousewheel: false,
            scrollbar: false,
            navigation: false,
            pagination: false,
            slidesOffsetAfter: -95,
            autoplay: {
                delay: 6000
            }
        };

        this.config3 = {
            a11y: true,
            direction: 'horizontal',
            slidesPerView: 2,
            keyboard: true,
            mousewheel: false,
            scrollbar: false,
            navigation: false,
            pagination: false,
            lazy: true,
            slidesOffsetBefore: 0,
            autoplay: {
                delay: 6000
            }
        };

        this.config4 = {
            a11y: true,
            direction: 'horizontal',
            slidesPerView: 3,
            observer: true,
            keyboard: true,
            mousewheel: false,
            scrollbar: false,
            navigation: false,
            pagination: false,
            autoplay: {
                delay: 6000
            }
        };
    }
}
