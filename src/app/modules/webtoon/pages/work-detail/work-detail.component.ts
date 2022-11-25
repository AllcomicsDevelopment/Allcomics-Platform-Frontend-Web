import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { TranslateService } from '@ngx-translate/core';

import { LoginDialogComponent } from '@shared/components/login-dialog/login-dialog.component';
import { ToBillingDialogComponent } from '../../components/to-billing-dialog/to-billing-dialog.component';
import { DetailDialogComponent } from '../../components/detail-dialog/detail-dialog.component';

import { ComicService } from '@core/services/comic.service';
import { LemonAuthService } from '@core/services/lemon-auth.service';
import { LoaderService } from '@core/services/loader.service';
import { ScrollService } from '@core/services/scroll.service';

import { TemplateInfo } from '@app/models/templateInfo';
import { Title  } from '@app/models/title';
import { Episode, EpisodeDetail, PayEpisode } from '@app/models/episode';

import * as fromRoot from '@app/store/root/root.reducer';
import * as RootActions from '@app/store/root/root.actions';

import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';

import * as fromEpisode from '../../store/episode/episode.reducer';
import * as EpisodeActions from '../../store/episode/episode.actions';
import { withLatestFrom, takeUntil, filter, map, switchMap } from 'rxjs/operators';

export interface PriceData {
    currency: string;
    rent: number;
    buy: number;
    expiresAt: string;
}

@Component({
    selector: 'app-work-detail',
    templateUrl: './work-detail.component.html',
    styleUrls: ['./work-detail.component.scss']
})
export class WorkDetailComponent implements OnInit, OnDestroy {
    public comicDetail: any;
    public selected = 'option1';
    public templateInfo: TemplateInfo;
    public total = 0;
    public episodes: Episode[];
    public sortType = 'asc';
    public isAuth = false;

    public title$: Observable<Title>;
    public episodes$: Observable<any>;
    public episodePage$: Observable<number>;
    public firstEpisode$: Observable<EpisodeDetail>;
    public isFetching$: Observable<boolean>;
    public episodeTotalPage$: Observable<number>;

    private profile: any;
    private profile$: Observable<any>;
    private firstEpisode: EpisodeDetail;
    private titleId: string;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(public dialog: MatDialog,
                private comicService: ComicService,
                private route: ActivatedRoute,
                private router: Router,
                private scrollService: ScrollService,
                private lemonService: LemonAuthService,
                private loaderService: LoaderService,
                private translate: TranslateService,
                private rootStore$: Store<fromRoot.State>,
                private episodeStore$: Store<fromEpisode.State>,
                private bottomDialog: MatBottomSheet,
                private snackBar: MatSnackBar) {
        this.route.paramMap.subscribe( (paramMaps: any) => {
            this.titleId = paramMaps.params.titleId;
            const params = { user_id: parseInt(localStorage.getItem('current_user'), 10) || -1, titleId: this.titleId, page: 0, limit: 10, sort: this.sortType };
            this.episodeStore$.dispatch(EpisodeActions.FetchTitleAndEpisodes({ params }));
        });
    }

    ngOnInit() {
        // this.lemonService.isAuthenticated().then(isAuth => this.isAuth = isAuth);
        this.setTemplateInfo();
        this.setupReducerListener();
        this.setupScrolledDownEventListener();
    }

    ngOnDestroy() {
        this.episodeStore$.dispatch(EpisodeActions.ResetTitle());
        this.episodeStore$.dispatch(EpisodeActions.ResetEpisodes());
        this.destroyed$.next(true);
        this.destroyed$.complete();
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

    openBottom(item: Episode | EpisodeDetail): void {
        const dialogRef = this.bottomDialog.open(DetailDialogComponent, { hasBackdrop: true, data: item });
        dialogRef.afterDismissed().subscribe((data: { billingType: 'rent' | 'buy', episode: Episode | EpisodeDetail } | null) => {
            if (!data) {
                return;
            }
            this.purchaseEpisode(data);
        });
    }

    private setupReducerListener() {
        this.profile$ = this.rootStore$.pipe(select(fromRoot.getProfile), filter(profile => !!profile), takeUntil(this.destroyed$));
        this.profile$.subscribe(profile => this.profile = profile);

        this.title$ = this.episodeStore$.pipe(select(fromEpisode.getTitle), filter(title => !!title), takeUntil(this.destroyed$));
        this.episodes$ = this.episodeStore$.pipe(select(fromEpisode.getEpisodes), takeUntil(this.destroyed$));
        this.firstEpisode$ = this.episodeStore$.pipe(select(fromEpisode.getFirstEpisode), takeUntil(this.destroyed$));
        this.isFetching$ = this.episodeStore$.pipe(select(fromEpisode.getIsFetching), takeUntil(this.destroyed$));
        this.episodePage$ = this.episodeStore$.pipe(
            select(fromEpisode.getEpisodes),
            map(episodes => episodes.page),
            takeUntil(this.destroyed$),
        );
        this.episodeTotalPage$ = this.episodeStore$.pipe(
            select(fromEpisode.getEpisodes),
            map(episodes => episodes.totalPage),
            takeUntil(this.destroyed$)
        );

        this.title$.subscribe(title => {
            this.comicDetail = title;
            this.templateInfo.txtTitle = title.name;
        });
        this.episodes$.subscribe(episode => {
            const { total, list } = episode;
            if (total) {
                this.total = total;
            }
            if (list) {
                this.episodes = list;
            }
            // get first Episode
            if (total && total > 0 && !this.firstEpisode) {
                this.episodeStore$.dispatch(EpisodeActions.FetchFirstEpisode({ titleId: this.titleId }));
            }
        });
        this.firstEpisode$.subscribe(firstEpisode => this.firstEpisode = firstEpisode);
    }

    private setupScrolledDownEventListener() {
        const shouldFetch$ = this.scrollService.onScrolledDown$.pipe(
            withLatestFrom(this.isFetching$, this.episodePage$, this.episodeTotalPage$),
            filter(([positions, isFetching, page, totalPage]) => !!!isFetching),
            filter(([positions, isFetching, page, totalPage]) => page + 1 <= totalPage),
            map(([positions, isFetching, page, totalPage]) => page),
            takeUntil(this.destroyed$)
        );

        shouldFetch$.subscribe(page => this.getEpisodes({ user_id: parseInt(localStorage.getItem('current_user'), 10) || -1, titleId: this.titleId, page: page + 1, limit: 10, sort: this.sortType }));
    }

    private getEpisodes(params: any = {}) {
        this.episodeStore$.dispatch(EpisodeActions.FetchEpisodes({ params }));
    }

    private purchaseEpisode(data: { billingType: 'rent' | 'buy', episode: Episode | EpisodeDetail }) {
        const { billingType: type, episode } = data;
        const { id: episodeId, displayPrice: { currency, rent, buy } } = episode;

        this.comicService.isAllcomicsAuth().toPromise().then(isAuth => {
            if (isAuth['body'].data.data.isValid) {

                this.comicService.getAllcomicsProfile().subscribe(res => {
                    const user_id = res['body'].data.data.user_id;
                    const balance = res['body'].data.data.balance;
                    const amount = (type === 'rent') ? rent : buy;


                    if (balance < amount) {
                        this.openBillingDialog();
                        return;
                    }

                    const payData = {
                        UserID: user_id,
                        ID: parseInt(episodeId.split('_')[0], 10),
                        EpisodeID: episodeId,
                        ContentType: 0,
                        PurchaseType: type === 'rent' ? 1 : 0
                    };

                    this.comicService.payEpisode(episodeId, payData).pipe(
                        withLatestFrom(this.translate.get('work-view.complete-pay-episode')),
                        takeUntil(this.destroyed$)
                    ).subscribe(resp => {
                        if (resp[0]['body'].data.Success) {
                            this.loaderService.hide();
                            this.openSnackBar(resp[1]);
                            this.rootStore$.dispatch(RootActions.GetProfile());
                            this.episodeStore$.dispatch(EpisodeActions.UpdateEpisodesAfterPayment({ episodeId }));
                            // nva
                            this.onShowDetail(this.titleId, episodeId);
                        }
                    }, err => {
                        this.loaderService.hide();
                        this.translate.get('work-view.error-pay-episode').subscribe(text => this.openSnackBar(text));
                    });

                });
            } else {
                this.openLoginDialog();
            }
        });
    }

    openSnackBar(message: string) {
         return this.snackBar.open(message, '', {
            duration: 1500,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
        });
    }

    openBillingDialog(): void {
        const toBillingDialogRef = this.dialog.open(ToBillingDialogComponent, {
            width: '400px',
            maxWidth: '90%',
            hasBackdrop: true,
            data: {}
        });
        toBillingDialogRef.afterClosed().subscribe(data => {
            if (!data) {
                return;
            }
            const { navigateToBilling } = data;
            if (navigateToBilling) {
                this.router.navigateByUrl('/payment');
            }
        });
    }

    checkFirstRoute() {
        const firstEpisode = this.firstEpisode || null;
        if (firstEpisode) {
            this.checkIsAvailable(firstEpisode);
        }
    }

    checkRoute(item: Episode): void {
        this.checkIsAvailable(item);
    }

    onShowDetail(title: string, id: string) {
        this.router.navigateByUrl('/webtoon/view/' + title + '/' + id);
    }

    changeSort(id: string, option: string) {
        this.sortType = option;
        this.episodeStore$.dispatch(EpisodeActions.ResetEpisodes());
        this.getEpisodes({ user_id: parseInt(localStorage.getItem('current_user'), 10) || -1, titleId: id, page: 0, limit: 10, sort: option });
    }

    getTranslateGenre(genres: any) {
        return genres ? genres.map(genre => this.translate.instant(`common.genre.${genre}`)) : [];
    }

    private setTemplateInfo() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 0;
        this.templateInfo.txtTitle = '';
    }

    private checkIsAvailable(episode: Episode | EpisodeDetail) {
        const { isFree, titleId, id: episodeId } = episode;
        if (isFree) {
            this.onShowDetail(titleId, episodeId);
            return;
        }
        const isNotAuth$ = this.lemonService.isAuthenticated$().pipe(filter(isAuth => !!!isAuth), takeUntil(this.destroyed$));
        isNotAuth$.subscribe(() => this.openLoginDialog());

        const isAuth$ = this.lemonService.isAuthenticated$().pipe(filter(isAuth => !!isAuth), takeUntil(this.destroyed$));
        isAuth$.subscribe(() => {
            const { isPurchased } = episode;
            if (isPurchased) {
                this.onShowDetail(titleId, episodeId);
                return;
            }
            this.openBottom(episode);
        });
    }

}
