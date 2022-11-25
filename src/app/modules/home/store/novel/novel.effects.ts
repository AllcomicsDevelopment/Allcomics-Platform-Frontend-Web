import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map, tap, withLatestFrom} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {of} from 'rxjs';
import {RouterReducerState} from '@ngrx/router-store';
import * as fromRouter from '@app/store/router/router.reducer';

import * as NovelActions from './novel.actions';
import * as fromNovel from './novel.reducer';

import {LoaderService} from '@core/services/loader.service';
import {ComicService} from '@core/services/comic.service';
import {UtilsService} from '@core/services/utils.service';
import {Banner} from '@app/models/banner';

@Injectable()
export class NovelEffects {

    constructor(private actions$: Actions,
                private loaderService: LoaderService,
                private novelStore$: Store<fromNovel.State>,
                private routerStore$: Store<RouterReducerState<fromRouter.RouterStateUrl>>,
                private utilsService: UtilsService,
                private comicsApiService: ComicService) {}

    fetchBannerList$ = createEffect(
        () => this.actions$.pipe(
            ofType(NovelActions.FetchBannerList),
            exhaustMap(action => {
                const { params } = action;
                return this.comicsApiService.getBanners({ ...params }).pipe(
                    map((banner: any) => NovelActions.SetSlideBanner({slideBanner: banner})),
                    catchError(error => of(NovelActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchNovelList$ = createEffect(
        () => this.actions$.pipe(
            ofType(NovelActions.FetchNovelList),
            withLatestFrom(this.novelStore$.pipe(select(fromNovel.getActiveDayAndNovel))),
            tap(() => this.novelStore$.dispatch(NovelActions.SetIsFetching({ isFetching: true }))),
            exhaustMap(([action, originNovel]) => {
                const { params } = action;
                const { day, novel } = originNovel;

                const { list: storedList } = novel; // stored webtoon data
                return this.comicsApiService.getNWeeks({ ...params }).pipe(
                    map( (resp) => {

                        // const { list: nextList, total, page, limit } = resp;
                        const { list: nextList, total, page, limit } = resp['body'].data.data;
                        const count = limit;


                        const list = page > 0 ? [ ...storedList, ...nextList ] : nextList;
                        const totalPage = this.utilsService.getTotalPage(total, count);
                        const res = { list, total, page, count, totalPage };

                        return NovelActions.SetNovelList({ day, res });
                    }),
                    tap(() => this.novelStore$.dispatch(NovelActions.SetIsFetching({ isFetching: false }))),
                    catchError(error => of(NovelActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchRankings$ = createEffect(
        () => this.actions$.pipe(
            ofType(NovelActions.FetchRankings),
            exhaustMap(action => {
                const { params } = action;
                return this.comicsApiService.getNovelRankings(params).pipe(
                    map(rankings => {
                        return NovelActions.SetRankings({rankings});
                    }),
                    catchError(error => of(NovelActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchCompleted$ = createEffect(
        () => this.actions$.pipe(
            ofType(NovelActions.FetchCompleted),
            exhaustMap(action => {
                const { params } = action;
                return this.comicsApiService.getNovelCompleted(params).pipe(
                    map(completed => NovelActions.SetCompleted({ completed })),
                    catchError(error => of(NovelActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchPopulars$ = createEffect(
        () => this.actions$.pipe(
            ofType(NovelActions.FetchPopulars),
            exhaustMap(action => {
                const { params } = action;
                return this.comicsApiService.getNovelPopular(params).pipe(
                    map(populars => NovelActions.SetPopulars({ populars })),
                    catchError(error => of(NovelActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchMillion$ = createEffect(
        () => this.actions$.pipe(
            ofType(NovelActions.FetchMillions),
            exhaustMap(action => {
                const { params } = action;
                return this.comicsApiService.getNovelMillion(params).pipe(
                    map(millions => NovelActions.SetMillions({ millions })),
                    catchError(error => of(NovelActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchRecent$ = createEffect(
        () => this.actions$.pipe(
            ofType(NovelActions.FetchRecents),
            exhaustMap(action => {
                const { params } = action;
                return this.comicsApiService.getNovelRecent(params).pipe(
                    map(recentlyUpdated => {
                        return NovelActions.SetRecents({ recentlyUpdated });
                    }),
                    catchError(error => of(NovelActions.RequestFailure({ error })))
                );
            })
        )
    );
}
