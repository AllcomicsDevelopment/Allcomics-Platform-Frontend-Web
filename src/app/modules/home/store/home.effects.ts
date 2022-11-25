import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, tap, exhaustMap } from 'rxjs/operators';

import { RouterReducerState } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import * as fromRouter from '../../../store/router/router.reducer';
import * as HomeActions from './home.actions';

import { ComicService } from '@core/services/comic.service';
import { LoaderService } from '@core/services/loader.service';
import {Banner, BannerInfo} from '@app/models/banner';

@Injectable()
export class HomeEffects {

    constructor(private actions$: Actions,
                private routerStore$: Store<RouterReducerState<fromRouter.RouterStateUrl>>,
                private loaderService: LoaderService,
                private comicsApiService: ComicService) {}

    fetchBannerList$ = createEffect(
        () => {
            return this.actions$.pipe(
                ofType(HomeActions.FetchBannerList),
                exhaustMap(action => {
                    const {params} = action;
                    return this.comicsApiService.getBanners({...params}).pipe(
                        map((banner: any) => {
                            return HomeActions.SetSlideBanner({slideBanner: banner});
                        }),
                        catchError(error => of(HomeActions.RequestFailure({error})))
                    );
                })
            );
        }
    );

    fetchSlideBanner$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeActions.FetchSlideBanner),
            exhaustMap(action => {
                const { slideBannerId } = action;
                return this.comicsApiService.getDetailBanner(slideBannerId).pipe(
                    map(slideBanner => HomeActions.SetSlideBanner({ slideBanner })),
                    catchError(error => of(HomeActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchBottomAdsBanner$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeActions.FetchBottomAdsBanner),
            exhaustMap(action => {
                const { bottomAdsBannerId } = action;
                return this.comicsApiService.getDetailBanner(bottomAdsBannerId).pipe(
                    map(bottomAdsBanner => HomeActions.SetBottomAdsBanner({ bottomAdsBanner })),
                    catchError(error => of(HomeActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchGoodsBanner$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeActions.FetchGoodsBanner),
            exhaustMap(action => {
                const { goodsBannerId } = action;
                return this.comicsApiService.getDetailBanner(goodsBannerId).pipe(
                    map(goodsBanner => HomeActions.SetGoodsBanner({ goodsBanner })),
                    catchError(error => of(HomeActions.RequestFailure({ error })))
                );
            })
        )
    );

    // titles
    FetchWeeks$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeActions.FetchWeeks),
            exhaustMap(action => {
                const { params } = action;
                return this.comicsApiService.getWeeks(params).pipe(
                    map(weeks => {
                        return HomeActions.SetWeeks({weeks});
                    }),
                    catchError(error => of(HomeActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchRankings$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeActions.FetchRankings),
            exhaustMap(action => {
                const { params } = action;
                return this.comicsApiService.getRankings(params).pipe(
                    map(rankings => {
                        return HomeActions.SetRankings({rankings});
                    }),
                    catchError(error => of(HomeActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchCompleted$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeActions.FetchCompleted),
            exhaustMap(action => {
                const { params } = action;
                return this.comicsApiService.getCompleted(params).pipe(
                    map(completed => HomeActions.SetCompleted({ completed })),
                    catchError(error => of(HomeActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchPopulars$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeActions.FetchPopulars),
            exhaustMap(action => {
                const { params } = action;
                return this.comicsApiService.getPopular(params).pipe(
                    map(populars => HomeActions.SetPopulars({ populars })),
                    catchError(error => of(HomeActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchRecentlyUpdated$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeActions.FetchRecentlyUpdated),
            exhaustMap(action => {
                const { params } = action;
                return this.comicsApiService.getRecentlyUpdated(params).pipe(
                    map(recentlyUpdated => HomeActions.SetRecentlyUpdated({ recentlyUpdated })),
                    catchError(error => of(HomeActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchRomance$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeActions.FetchRomance),
            exhaustMap(action => {
                const { params } = action;
                return this.comicsApiService.getRomance(params).pipe(
                    map(romance => HomeActions.SetRomance({ romance })),
                    catchError(error => of(HomeActions.RequestFailure({ error })))
                );
            })
        )
    );

    fetchBoysLove$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeActions.FetchBoysLove),
            exhaustMap(action => {
                const { params } = action;
                return this.comicsApiService.getBoysLove(params).pipe(
                    map(boysLove => HomeActions.SetBoysLove({ boysLove })),
                    catchError(error => of(HomeActions.RequestFailure({ error })))
                );
            })
        )
    );



    requestFailure$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeActions.RequestFailure),
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

