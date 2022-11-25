import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, tap, exhaustMap, withLatestFrom } from 'rxjs/operators';

import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import * as fromRouter from '../../../store/router/router.reducer';
import * as MyPageActions from './my-page.actions';
import * as fromMyPage from './my-page.reducer';

import { ComicService } from '@core/services/comic.service';
import { LoaderService } from '@core/services/loader.service';
import { UtilsService } from '@core/services/utils.service';

@Injectable()
export class MyPageEffects {

    constructor(private actions$: Actions,
                private loaderService: LoaderService,
                private utilsService: UtilsService,
                private myPageStore$: Store<fromMyPage.State>,
                private routerStore$: Store<RouterReducerState<fromRouter.RouterStateUrl>>,
                private comicService: ComicService) {}

    requestFailure$ = createEffect(
        () => this.actions$.pipe(
            ofType(MyPageActions.RequestFailure),
            map(action => action.error),
            tap(() => this.loaderService.hide()),
            tap(error => {
                const errorMessage = error['message'] || error['statusText'] || error;
                alert(`Error! ${errorMessage}`);
            }),
        ),
        { dispatch: false }
    );

    fetchFavorites$ = createEffect(
        () => this.actions$.pipe(
            ofType(MyPageActions.FetchFavorites),
            withLatestFrom(this.myPageStore$.pipe(select(fromMyPage.getFavorites))),
            tap(() => this.myPageStore$.dispatch(MyPageActions.SetIsFetching({ isFetching: true }))),
            exhaustMap(([action, cachedFavorites]) => {
                const { params } = action;
                const { list: cachedList } = cachedFavorites;
                const { page, limit } = params;
                return this.comicService.getFavoriteList$({ page, limit }).pipe(
                    map(res => {
                        const { list: nextList, total, page: nextPage } = res;
                        const list = page > 0 ? [ ...cachedList, ...nextList] : nextList;
                        const totalPage = this.utilsService.getTotalPage(total, limit);
                        const favorites = { list, total, page: nextPage, limit, totalPage };
                        return MyPageActions.SetFavorites({ favorites });
                    }),
                    tap(() => this.myPageStore$.dispatch(MyPageActions.SetIsFetching({ isFetching: false }))),
                    catchError(error => of(MyPageActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchPurchased$ = createEffect(
        () => this.actions$.pipe(
            ofType(MyPageActions.FetchPurchased),
            withLatestFrom(this.myPageStore$.pipe(select(fromMyPage.getPurchased))),
            tap(() => this.myPageStore$.dispatch(MyPageActions.SetIsFetching({ isFetching: true }))),
            exhaustMap(([action, cachedPurchased]) => {
                const { params } = action;
                const { list: cachedList } = cachedPurchased;
                const { page, limit } = params;
                return this.comicService.getPurchased$({ page, limit }).pipe(
                    map(res => {
                        const { list: nextList, total, page: nextPage } = res;
                        const list = page > 1 ? [ ...cachedList, ...nextList] : nextList;
                        const totalPage = this.utilsService.getTotalPage(total, limit);
                        const purchased = { list, total, page: nextPage, limit, totalPage };
                        return MyPageActions.SetPurchased({ purchased });
                    }),
                    tap(() => this.myPageStore$.dispatch(MyPageActions.SetIsFetching({ isFetching: false }))),
                    catchError(error => of(MyPageActions.RequestFailure({ error })))
                );
            })
        )
    );

}

