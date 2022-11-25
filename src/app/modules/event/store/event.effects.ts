import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, tap, exhaustMap } from 'rxjs/operators';

import { RouterReducerState } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import * as fromRouter from '../../../store/router/router.reducer';
import * as EventActions from './event.actions';

import { ComicService } from '@core/services/comic.service';
import { LoaderService } from '@core/services/loader.service';
import { BannerInfo } from '@app/models/banner';

@Injectable()
export class EventEffects {

    constructor(private actions$: Actions,
                private routerStore$: Store<RouterReducerState<fromRouter.RouterStateUrl>>,
                private loaderService: LoaderService,
                private comicsApiService: ComicService) {}

    fetchBannerList$ = createEffect(
        () => this.actions$.pipe(
            ofType(EventActions.FetchBannerList),
            exhaustMap(action => {
                const { category, params } = action;
                return this.comicsApiService.getBanners({ ...params, category }).pipe(
                    map(({ total, list }) => EventActions.SetBannerList({ total, list })),
                    catchError(error => of(EventActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchEventMainBanner$ = createEffect(
        () => this.actions$.pipe(
            ofType(EventActions.FetchEventMainBanner),
            exhaustMap(action => {
                const { eventMainBannerId } = action;
                return this.comicsApiService.getDetailBanner(eventMainBannerId).pipe(
                    map(eventMainBanner => EventActions.SetEventMainBanner({ eventMainBanner })),
                    catchError(error => of(EventActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchEventInfoBanner$ = createEffect(
        () => this.actions$.pipe(
            ofType(EventActions.FetchEventInfoBanner),
            exhaustMap(action => {
                const { eventInfoBannerId } = action;
                return this.comicsApiService.getDetailBanner(eventInfoBannerId).pipe(
                    map(eventInfoBanner => EventActions.SetEventInfoBanner({ eventInfoBanner })),
                    catchError(error => of(EventActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchEventFreeBanner$ = createEffect(
        () => this.actions$.pipe(
            ofType(EventActions.FetchEventFreeBanner),
            exhaustMap(action => {
                const { eventFreeBannerId } = action;
                return this.comicsApiService.getDetailBanner(eventFreeBannerId).pipe(
                    map(eventFreeBanner => EventActions.SetEventFreeBanner({ eventFreeBanner })),
                    catchError(error => of(EventActions.RequestFailure({ error })))
                );
            })
        )
    );

    // titles
    fetchRankings$ = createEffect(
        () => this.actions$.pipe(
            ofType(EventActions.FetchRankings),
            exhaustMap(action => {
                const { params } = action;
                return this.comicsApiService.getRankings(params).pipe(
                    map(rankings => EventActions.SetRankings({ rankings })),
                    catchError(error => of(EventActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchPopulars$ = createEffect(
        () => this.actions$.pipe(
            ofType(EventActions.FetchPopulars),
            exhaustMap(action => {
                const { params } = action;
                return this.comicsApiService.getPopular(params).pipe(
                    map(populars => EventActions.SetPopulars({ populars })),
                    catchError(error => of(EventActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchCompleted$ = createEffect(
        () => this.actions$.pipe(
            ofType(EventActions.FetchCompleted),
            exhaustMap(action => {
                const { params } = action;
                return this.comicsApiService.getCompleted(params).pipe(
                    map(completed => EventActions.SetCompleted({ completed })),
                    catchError(error => of(EventActions.RequestFailure({ error })))
                );
            })
        )
    );

    requestFailure$ = createEffect(
        () => this.actions$.pipe(
            ofType(EventActions.RequestFailure),
            map(action => action.error),
            tap(error => {
                const errorBanner = error['banner'] || error['statusText'] || error;
                alert(`Error! ${errorBanner}`);
            }),
            tap(() => this.loaderService.hide())
        ),
        { dispatch: false }
    );

}

