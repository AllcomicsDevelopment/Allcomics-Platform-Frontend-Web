import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { TemplateInfo } from '@app/models/templateInfo';

import { ComicService } from '@core/services/comic.service';
import { LemonAuthService } from '@core/services/lemon-auth.service';
import { Position, ScrollService } from '@core/services/scroll.service';

import { isNull } from 'util';

import { Observable, ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as fromSupport from '../../store/support.reducer';
import * as SupportActions from '../../store/support.actions';

import { filter, map, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Category, } from '@app/models/message';
import { MessageList} from '../../store/support.reducer';
import * as fromRoot from '@app/store/root/root.reducer';

import { NotificationDialogComponent } from '@app/modules/support/components/notification-dialog/notification-dialog.component';
import {LoginDialogComponent} from '@shared/components/login-dialog/login-dialog.component';

export const TabItems = [
    { category: 'notice' },
    { category: 'faq' },
    { category: 'inquiry' },
];

@Component({
    selector: 'app-customer-support',
    templateUrl: './customer-support.component.html',
    styleUrls: ['./customer-support.component.scss']
})
export class CustomerSupportComponent implements OnInit, OnDestroy {

    confirmationMessage = '';

    public lastScrollTop = 0;
    public templateInfo: TemplateInfo;
    public selectedIndex = 0;

    public isAuthenticated$: Observable<boolean>;
    public inquiryList$: Observable<MessageList>;
    public faqList$: Observable<MessageList>;
    public noticeList$: Observable<MessageList>;
    public currentTotalPage$: Observable<number>;
    public currentPage$: Observable<number>;
    public activeCategory$: Observable<Category>;
    public isFetching$: Observable<boolean>;
    private profile$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private comicService: ComicService,
                private lemonService: LemonAuthService,
                private scrollService: ScrollService,
                private supportStore$: Store<fromSupport.State>,
                private rootStore$: Store<fromRoot.State>,
                private translate: TranslateService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.isAuthenticated$ = this.lemonService.isAuthenticated$().pipe(takeUntil(this.destroyed$));
        this.translate.get('customer-support.inquiry.confirmation').subscribe(text => this.confirmationMessage = text);

        this.setTemplateInfo();
        this.setupReducerListener();
        this.setupBottomBar();
        this.setupInfiniteScroll();
        this.fetchInitMessages();
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    onChangeTab(event: any) {
        const { index } = event;
        const category = TabItems[index].category;
        this.supportStore$.dispatch(SupportActions.SetActiveCategory({ category }));
    }

    onPostInquiry(inquiry: { title: string, content: string }) {
        const { title, content } = inquiry;
        // const checkIsAuth$ = this.isAuthenticated$.pipe(filter(isAuth => !!!isAuth), takeUntil(this.destroyed$));
        // checkIsAuth$.subscribe(() => this.openLoginDialog());

        this.lemonService.isAllcomicsAuth().toPromise().then(auth => {
            if (auth['body'].data.data.isValid) {
                this.lemonService.getAllcomicsProfile().pipe(
                    switchMap(profile => {
                        const author = profile['body'].data.data.user_id;
                        const category = 'common';
                        const subCategory = 'etc';
                        const type = 'user';
                        return this.comicService.postInquiry({ title, content, author, category, subCategory, type });
                    })
                ).subscribe(() => {
                    const notiDialogRef = this.dialog.open(NotificationDialogComponent, {
                        width: '320px',
                        maxWidth: '90%',
                        hasBackdrop: true,
                        data: {
                            messages: this.confirmationMessage
                        }
                    });
                    notiDialogRef.afterClosed().subscribe(() => window.location.reload());
                });
            } else {
                this.openLoginDialog();
            }
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

    private fetchInitMessages() {
        // set current category
        const index = this.selectedIndex;
        const category = TabItems[index].category;
        this.supportStore$.dispatch(SupportActions.SetActiveCategory({ category }));

        // fetch messages
        const params = { page: 0, limit: 10 };
        this.supportStore$.dispatch(SupportActions.FetchFaqList({ params }));
        this.supportStore$.dispatch(SupportActions.FetchNoticeList({ params }));
        // inquiry??? ??????, ????????? ????????? ???????????? ?????????????????? ????????? profile ???????????? ?????????.
        // this.profile$ = this.rootStore$.pipe(select(fromRoot.getProfile), filter(profile => !!profile), takeUntil(this.destroyed$));
        this.profile$ = this.lemonService.getAllcomicsProfile();
        this.profile$.subscribe((res) => {
            params['UserID'] = res['body'].data.data.user_id;
            this.supportStore$.dispatch(SupportActions.FetchInquiryList({params}));
        });
    }

    private setupReducerListener() {
        this.inquiryList$ = this.supportStore$.pipe(select(fromSupport.getInquiryList), takeUntil(this.destroyed$));
        this.faqList$ = this.supportStore$.pipe(select(fromSupport.getFaqList), takeUntil(this.destroyed$));
        this.noticeList$ = this.supportStore$.pipe(select(fromSupport.getNoticeList), takeUntil(this.destroyed$));
        this.currentTotalPage$ = this.supportStore$.pipe(select(fromSupport.getActiveTotalPage), takeUntil(this.destroyed$));
        this.currentPage$ = this.supportStore$.pipe(select(fromSupport.getActivePage), takeUntil(this.destroyed$));
        this.activeCategory$ = this.supportStore$.pipe(select(fromSupport.getActiveCategory), takeUntil(this.destroyed$));
        this.isFetching$ = this.supportStore$.pipe(select(fromSupport.getIsFetching), takeUntil(this.destroyed$));
    }

    private setupInfiniteScroll() {
        const shouldFetch$ = this.scrollService.onScrolledDown$.pipe(
            withLatestFrom(this.isFetching$, this.currentPage$, this.currentTotalPage$, this.activeCategory$),
            filter(([positions, isFetching, page, totalPage, category]) => !!!isFetching),
            filter(([positions, isFetching, page, totalPage, category]) => page + 1 <= totalPage),
            map(([positions, isFetching, page, totalPage, category]) => ({ page, category })),
            takeUntil(this.destroyed$)
        );
        shouldFetch$.subscribe(({ page, category }) => {
            const params = { page: page + 1, limit: 10 };
            switch (category) {
                case 'inquiry':
                    this.supportStore$.dispatch(SupportActions.FetchInquiryList({ params }));
                    return;
                case 'faq':
                    this.supportStore$.dispatch(SupportActions.FetchFaqList({ params }));
                    return;
                case 'notice':
                default:
                    this.supportStore$.dispatch(SupportActions.FetchNoticeList({ params }));
                    return;
            }
        });
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

    private setTemplateInfo() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 3;
        this.templateInfo.botbar = true;
        this.templateInfo.txtTitle = 'customerSupport';
    }

}
