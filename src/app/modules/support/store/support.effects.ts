import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, tap, exhaustMap, withLatestFrom, filter } from 'rxjs/operators';

import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import * as fromRouter from '../../../store/router/router.reducer';
import * as SupportActions from './support.actions';

import { ComicService } from '@core/services/comic.service';
import { UtilsService } from '@core/services/utils.service';
import { LoaderService } from '@core/services/loader.service';

import { Category, Type } from '@app/models/message';
import * as fromSupport from '@app/modules/support/store/support.reducer';
import * as fromRoot from '@app/store/root/root.reducer';

@Injectable()
export class SupportEffects {

    private messageType: Type = 'user';
    private DEFAULT_LIMIT = 15;

    constructor(private actions$: Actions,
                private routerStore$: Store<RouterReducerState<fromRouter.RouterStateUrl>>,
                private supportStore$: Store<fromSupport.State>,
                private rootStore$: Store<fromRoot.State>,
                private utilsService: UtilsService,
                private loaderService: LoaderService,
                private comicsApiService: ComicService) {}

    requestFailure$ = createEffect(
        () => this.actions$.pipe(
            ofType(SupportActions.RequestFailure),
            map(action => action.error),
            tap(error => {
                const errorMessage = error['message'] || error['statusText'] || error;
                alert(`Error! ${errorMessage}`);
            }),
            tap(() => this.loaderService.hide())
        ),
        { dispatch: false }
    );

    createNewMessage$ = createEffect(
        () => this.actions$.pipe(
            ofType(SupportActions.CreateNewMessage),
            exhaustMap(action => {
                const { messageType: type, message } = action;
                return this.comicsApiService.addMessage({ ...message, type }).pipe(
                    map(() => SupportActions.RequestSuccess()),
                    tap(() => alert(`문의 등록이 완료되었습니다.`)),
                    catchError(error => of(SupportActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchFaqList$ = createEffect(
        () => this.actions$.pipe(
            ofType(SupportActions.FetchFaqList),
            withLatestFrom(this.supportStore$.pipe(select(fromSupport.getFaqList))),
            tap(() => this.supportStore$.dispatch(SupportActions.SetIsFetching({ isFetching: true }))),
            exhaustMap(([action, originFaq]) => {
                const { params } = action;
                const category: Category = 'faq';
                const { page } = params; // TODO: should be new page...
                const { list: prevList } = originFaq;
                return this.comicsApiService.getMessageListFreq({ ...params, category, type: this.messageType }).pipe(
                    map(({ list: nextList, total }) => {
                        const list = page > 0 ? [ ...prevList, ...nextList ] : nextList;
                        return { list, total, page, totalPage: this.utilsService.getTotalPage(total, this.DEFAULT_LIMIT) };
                    }),
                    tap(() => this.supportStore$.dispatch(SupportActions.SetIsFetching({ isFetching: false }))),
                    map(({ list, total, page: newPage, totalPage }) => SupportActions.SetFaqList({ list, total, totalPage, page: newPage })),
                    catchError(error => of(SupportActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchInquiryList = createEffect(
        () => this.actions$.pipe(
            ofType(SupportActions.FetchInquiryList),
            withLatestFrom(this.supportStore$.pipe(select(fromSupport.getInquiryList))),
            tap(() => this.supportStore$.dispatch(SupportActions.SetIsFetching({ isFetching: true }))),
            exhaustMap(([action, originInquiry]) => {
                const { params } = action;
                const authorId = params['UserID'];
                const category: Category = 'inquiry';
                const { page } = params; // TODO: should be new page...
                const { list: prevList } = originInquiry;
                return this.comicsApiService.getMessageListUser({ ...params, category, type: this.messageType, authorId }).pipe(
                    map(({ list: nextList, total }) => {
                        const list = page > 0 ? [ ...prevList, ...nextList ] : nextList;
                        return { list, total, page, totalPage: this.utilsService.getTotalPage(total, this.DEFAULT_LIMIT) };
                    }),
                    tap(() => this.supportStore$.dispatch(SupportActions.SetIsFetching({ isFetching: false }))),
                    map(({ list, total, page: newPage, totalPage }) => SupportActions.SetInquiryList({ list, total, totalPage, page: newPage })),
                    catchError(error => of(SupportActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchNoticeList$ = createEffect(
        () => this.actions$.pipe(
            ofType(SupportActions.FetchNoticeList),
            withLatestFrom(this.supportStore$.pipe(select(fromSupport.getNoticeList))),
            tap(() => this.supportStore$.dispatch(SupportActions.SetIsFetching({ isFetching: true }))),
            exhaustMap(([action, originNotice]) => {
                const { params } = action;
                const category: Category = 'notice';
                const { page } = params; // TODO: should be new page...
                const { list: prevList } = originNotice;
                return this.comicsApiService.getMessageList({ ...params, category, type: this.messageType }).pipe(
                    map(({ list: nextList, total }) => {
                        const list = page > 0 ? [ ...prevList, ...nextList ] : nextList;
                        return { list, total, page, totalPage: this.utilsService.getTotalPage(total, this.DEFAULT_LIMIT) };
                    }),
                    map(({ list, total, page: newPage, totalPage }) => SupportActions.SetNoticeList({ list, total, totalPage, page: newPage })),
                    catchError(error => of(SupportActions.RequestFailure({ error })))
                );
            })
        )
    );
}

