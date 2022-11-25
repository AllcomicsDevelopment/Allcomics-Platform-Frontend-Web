import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, tap, exhaustMap, withLatestFrom } from 'rxjs/operators';

import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import * as fromRouter from '../../../../store/router/router.reducer';

import * as WebtoonActions from './webtoon.actions';
import * as fromWebtoon from '@app/modules/novel/store/webtoon/webtoon.reducer';

import { ComicService } from '@core/services/comic.service';
import { LoaderService } from '@core/services/loader.service';
import { UtilsService } from '@core/services/utils.service';

@Injectable()
export class WebtoonEffects {

    constructor(private actions$: Actions,
                private loaderService: LoaderService,
                private webtoonStore$: Store<fromWebtoon.State>,
                private routerStore$: Store<RouterReducerState<fromRouter.RouterStateUrl>>,
                private utilsService: UtilsService,
                private comicService: ComicService) {}

    requestFailure$ = createEffect(
        () => this.actions$.pipe(
            ofType(WebtoonActions.RequestNFailure),
            map(action => action.error),
            tap(() => this.loaderService.hide()),
            tap(error => {
                const errorMessage = error['message'] || error['statusText'] || error;
                alert(`Error! ${errorMessage}`);
            }),
        ),
        { dispatch: false }
    );

    fetchWebtoonList$ = createEffect(
        () => this.actions$.pipe(
            ofType(WebtoonActions.FetchNovelList),
            withLatestFrom(this.webtoonStore$.pipe(select(fromWebtoon.getActiveGenreAndWebtoon))),
            tap(() => this.webtoonStore$.dispatch(WebtoonActions.SetIsNFetching({ isFetching: true }))),
            exhaustMap(([action, originWebtoon]) => {
                const { params } = action;
                const { genre, webtoon } = originWebtoon;
                // const detectedGenre = genre === 'romance' ? '' : genre;
                const { list: storedList } = webtoon; // stored webtoon data
                return this.comicService.getGenreTitles({ ...params }).pipe(
                    map((resp) => {
                        const {list: nextList, total, page, count } = resp;
                        const list = page > 0 ? [ ...storedList, ...nextList ] : nextList;
                        const totalPage = this.utilsService.getTotalPage(total, count);
                        const res = { list, total, page, count, totalPage };
                        return WebtoonActions.SetNovelList({ genre, res });
                    }),
                    tap(() => this.webtoonStore$.dispatch(WebtoonActions.SetIsNFetching({ isFetching: false }))),
                    catchError(error => of(WebtoonActions.RequestNFailure({ error })))
                );
            })
        )
    );

    fetchBannerList$ = createEffect(
        () => this.actions$.pipe(
            ofType(WebtoonActions.FetchNGenresBannerList),
            exhaustMap(action => {
                const { category, params } = action;
                return this.comicService.getBanners({ ...params, category }).pipe(
                    map(({ total, list }) => WebtoonActions.SetNGenresBannerList({ total, list })),
                    catchError(error => of(WebtoonActions.RequestNFailure({ error })))
                );
            })
        )
    );

    fetchActiveGenreBanner$ = createEffect(
        () => this.actions$.pipe(
            ofType(WebtoonActions.FetchNActiveGenreBanner),
            withLatestFrom(this.webtoonStore$.pipe(select(fromWebtoon.getActiveGenre))),
            tap(() => this.loaderService.show()),
            exhaustMap(([action, genre]) => {
                const { bannerId } = action;
                return this.comicService.getDetailBanner(bannerId).pipe(
                    tap(() => this.loaderService.hide()),
                    map(banner => WebtoonActions.SetNActiveGenreBanner({ genre, banner })),
                    catchError(error => of(WebtoonActions.RequestNFailure({ error })))
                );
            })
        )
    );

}

