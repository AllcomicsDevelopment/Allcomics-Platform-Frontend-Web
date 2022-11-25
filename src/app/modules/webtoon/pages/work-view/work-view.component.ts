import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatSnackBar } from '@angular/material';

import { TemplateInfo } from '@app/models/templateInfo';
import { Episode, EpisodeDetail, PayEpisode } from '@app/models/episode';

import { ComicService } from '@core/services/comic.service';
import { LemonAuthService } from '@core/services/lemon-auth.service';

import { LoginDialogComponent } from '@shared/components/login-dialog/login-dialog.component';
import { Position, ScrollService } from '@core/services/scroll.service';

import {filter, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';

import * as fromEpisode from '@app/modules/webtoon/store/episode/episode.reducer';
import * as EpisodeActions from '@app/modules/webtoon/store/episode/episode.actions';
import * as fromRoot from '@app/store/root/root.reducer';

import { DetailDialogComponent } from '@app/modules/webtoon/components/detail-dialog/detail-dialog.component';
import { ToBillingDialogComponent } from '@app/modules/webtoon/components/to-billing-dialog/to-billing-dialog.component';
import { Location } from '@angular/common';
import { LoaderService } from '@core/services/loader.service';
import * as RootActions from '@app/store/root/root.actions';

@Component({
    selector: 'app-work-view',
    templateUrl: './work-view.component.html',
    styleUrls: ['./work-view.component.scss'],
    animations: [
        trigger('hideControl', [
            state('show', style({
                height: '55px', bottom: '0'
            })),
            state('hide', style({
                height: '0', bottom: '-7px'
            })),
            transition('show=>hide', animate('100ms')),
            transition('hide=>show', animate('100ms'))
        ]),
    ]
})
export class WorkViewComponent implements OnInit, OnDestroy {
    public templateInfo: TemplateInfo;
    public controlState: string;
    public lastScrollTop: number;

    public titleId: string;
    public episodeId: string;
    public total: number;
    public isAuth = false;
    private profile: any;
    private profile$: Observable<any>;

    public nextEpisodeId: string;
    public prevEpisodeId: string;
    public detailEpisode$: Observable<any>;
    public isAvailable = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private comicService: ComicService,
                public dialog: MatDialog,
                private route: ActivatedRoute,
                private authService: LemonAuthService,
                private scrollService: ScrollService,
                private rootStore$: Store<fromRoot.State>,
                private episodeStore$: Store<fromEpisode.State>,
                private lemonService: LemonAuthService,
                private loaderService: LoaderService,
                private bottomDialog: MatBottomSheet,
                private translate: TranslateService,
                private snackBar: MatSnackBar,
                private location: Location,
                private router: Router) {
        this.controlState = 'show';
        this.route.paramMap.subscribe( (paramMaps: any) => {
            this.titleId = paramMaps.params.titleId;
            this.episodeId = paramMaps.params.episodeId;
        });
    }

    ngOnInit() {
        this.authService.isAuthenticated().then(isAuth => this.isAuth = isAuth);
        this.profile$ = this.rootStore$.pipe(select(fromRoot.getProfile), filter(profile => !!profile), takeUntil(this.destroyed$));
        this.profile$.subscribe(profile => this.profile = profile);

        this.setTemplateInfo();
        this.setupScrollEvent();
        this.getEpisode(this.episodeId);
    }

    ngOnDestroy() {
        this.resetDetailEpisode();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    private resetDetailEpisode() {
        this.episodeStore$.dispatch(EpisodeActions.SetDetailEpisode({ detailEpisode: null }));
    }

    scroll(pos: Position) {
        const { scrollHeight, scrollTop, offsetHeight } = pos;
        const PADDING_HEIGHT = 10;
        const position = scrollTop;
        const maxScroll = scrollHeight - offsetHeight - PADDING_HEIGHT;
        const shouldHide = (position > this.lastScrollTop) && (maxScroll - position > 0);
        this.controlState = shouldHide ? 'hide' : 'show';
        this.lastScrollTop = position;
    }

    private setTemplateInfo() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 6;
        this.templateInfo.botbar = false;
        this.templateInfo.txtTitle = '';
    }

    private setupScrollEvent() {
        this.scrollService.onScroll$.pipe(takeUntil(this.destroyed$)).subscribe(pos => this.scroll(pos));
    }

    onContentTouch(): void {
        this.controlState === 'show' ?  this.controlState = 'hide' : this.controlState = 'show';
    }

    getEpisode(id: string) {
        const episodeId = id;
        // TODO: check is available!!!
        this.episodeStore$.dispatch(EpisodeActions.FetchDetailEpisode({ episodeId }));
        // setup listener
        this.detailEpisode$ = this.episodeStore$.pipe(select(fromEpisode.getDetailEpisode), filter(episode => !!episode), takeUntil(this.destroyed$));
        this.detailEpisode$.subscribe(episode => {
            this.prevEpisodeId = episode.prevId;
            this.nextEpisodeId = episode.nextId;
            this.checkIsAvailable(episode);
        });
    }

    onShowPrev() {
        this.translate.get('work-view.no-prev-episode').subscribe(text => {
            if (this.prevEpisodeId) {
                window.location.replace('/webtoon/view/' + this.titleId + '/' + this.prevEpisodeId);
                return;
            }
            this.openSnackBar(text);
        });
    }

    onShowNext() {
        this.translate.get('work-view.no-next-episode').subscribe(text => {
            if (this.nextEpisodeId) {
                window.location.replace('/webtoon/view/' + this.titleId + '/' + this.nextEpisodeId);
                return;
            }
            this.openSnackBar(text);
        });
    }

    private purchaseEpisode(data: { billingType: 'rent' | 'buy', episode: Episode | EpisodeDetail }) {
        const { billingType: type, episode } = data;
        const { id: webtoonId, titleID: episodeId, displayPrice: { currency, rent, buy } } = episode;
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
                        ID: parseInt(webtoonId, 10),
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
                            this.isAvailable = true;
                            this.rootStore$.dispatch(RootActions.GetProfile());
                            this.episodeStore$.dispatch(EpisodeActions.UpdateEpisodesAfterPayment({ episodeId }));
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

        // const { billingType: type, episode } = data;
        // const { displayPrice: { currency, rent, buy }, id: episodeId } = episode;
        //
        // const myTDNPoint = this.profile.tdn.total;
        // const amount = (type === 'rent') ? rent : buy;
        // if (myTDNPoint < amount) {
        //     this.openBillingDialog();
        //     return;
        // }
        // // purchase episode
        // // TODO: refactor below to use effect
        // this.loaderService.show();
        // const payData: PayEpisode = { type, tdn: amount, name: `${episodeId}-${type}: ${amount} ${currency}` };
        // this.comicService.payEpisode(episodeId, payData).pipe(
        //     withLatestFrom(this.translate.get('work-view.complete-pay-episode')),
        //     takeUntil(this.destroyed$)
        // ).subscribe(([_, text]) => {
        //     this.loaderService.hide();
        //     this.rootStore$.dispatch(RootActions.GetProfile());
        //     this.openSnackBar(text);
        //     this.isAvailable = true;
        //     this.getEpisode(this.episodeId);
        // }, err => {
        //     this.loaderService.hide();
        //     this.isAvailable = false;
        //     this.translate.get('work-view.error-pay-episode').subscribe(text => {
        //         this.openSnackBar(text);
        //     });
        // });
    }

    private checkIsAvailable(episode: Episode | EpisodeDetail) {

        this.comicService.getAllcomicsProfile().subscribe(profile => {
            const user_id = profile['body'].data.data.user_id;
            if (user_id <= 0) {
                // should be login
                this.openLoginDialog();
            } else {
                if (episode.isPurchased || episode.isFree) {
                    // purchased webtoon
                    this.isAvailable = true;
                } else {
                    // not purchased
                    this.isAvailable = false;
                    this.openBottom(episode);
                }
                // this.comicService.getEpisodeDetail()
            }
        });

        // const { isFree } = episode;
        // if (isFree) {
        //     this.isAvailable = true;
        //     return;
        // }
        // const isNotAuth$ = this.lemonService.isAuthenticated$().pipe(filter(isAuth => !!!isAuth), takeUntil(this.destroyed$));
        // isNotAuth$.subscribe(() => this.openLoginDialog());
        //
        // const isAuth$ = this.lemonService.isAuthenticated$().pipe(filter(isAuth => !!isAuth), takeUntil(this.destroyed$));
        // isAuth$.subscribe(() => {
        //     const { isPurchased } = episode;
        //     if (this.isAvailable) {
        //         return;
        //     }
        //     if (isPurchased) {
        //         this.isAvailable = true;
        //         return;
        //     }
        //     this.openBottom(episode);
        // });
    }

    openSnackBar(message: string) {
        return this.snackBar.open(message, '', {
            duration: 1500,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
        });
    }

    openLoginDialog(): void {
        const redirectPath = this.router.url;
        this.dialog.open(LoginDialogComponent, {
            width: '400px',
            hasBackdrop: true,
            maxWidth: '90%',
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
                this.router.navigateByUrl('billing');
            }
        });
    }

    // TODO: refactor below
    private  getContentCoinPrice(currency: string, originPrice: number): { target: string; price: number; } {
        const exchange = this.comicService.getExchange(currency);
        const { target, ratio, decimal } = exchange;
        const price = this.getTargetPrice(originPrice, ratio || 1, decimal || 0);
        return { target, price };
    }

    private getTargetPrice(sourcePrice: number, ratio: number = 1, decimal: number = 0) {
        const A = sourcePrice * ratio;
        const D = Math.pow(10, decimal);
        const total = Math.round(A * D) / D;
        return total;
    }
}
