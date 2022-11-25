import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of, zip } from 'rxjs';
import { catchError, map, tap, exhaustMap, withLatestFrom } from 'rxjs/operators';

import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import * as fromRouter from '../../../../store/router/router.reducer';
import * as EpisodeActions from './episode.actions';
import * as fromEpisode from '@app/modules/novel/store/episode/episode.reducer';

import { ComicService } from '@core/services/comic.service';
import { LoaderService } from '@core/services/loader.service';
import { UtilsService } from '@core/services/utils.service';
import { EpisodeDetail } from '@app/models/episode';

@Injectable()
export class EpisodeEffects {

    constructor(private actions$: Actions,
                private loaderService: LoaderService,
                private utilsService: UtilsService,
                private episodeStore$: Store<fromEpisode.State>,
                private routerStore$: Store<RouterReducerState<fromRouter.RouterStateUrl>>,
                private comicService: ComicService) {}

    requestFailure$ = createEffect(
        () => this.actions$.pipe(
            ofType(EpisodeActions.RequestNFailure),
            map(action => action.error),
            tap(() => this.loaderService.hide()),
            tap(error => {
                const errorMessage = error['message'] || error['statusText'] || error;
                alert(`Error! ${errorMessage}`);
            }),
        ),
        { dispatch: false }
    );

    fetchTitleAndEpisodes$ = createEffect(
        () => this.actions$.pipe(
            ofType(EpisodeActions.FetchTitleAndNEpisodes),
            withLatestFrom(this.episodeStore$.pipe(select(fromEpisode.getNEpisodes))),
            tap(() => this.loaderService.show()),
            exhaustMap(([action, cachedEpisodes]) => {
                const { params } = action;
                const { list: cachedList } = cachedEpisodes;
                const { titleId, page, limit, sort } = params;
                return zip(this.comicService.getNTitles(titleId), this.comicService.getNEpisodes({ user_id: parseInt(localStorage.getItem('user_id'), 10) || -1, id: titleId, page, limit, sort })).pipe(
                    map(([title, res]) => {
                        const { list: nextList, total, page: nextPage } = res;
                        const list = page > 0 ? [ ...cachedList, ...nextList] : nextList;
                        const totalPage = this.utilsService.getTotalPage(total, limit);
                        const episodes = { list, total, page: nextPage, limit, totalPage };
                        return EpisodeActions.SetTitleAndNEpisodes({ title, episodes });
                    }),
                    tap(() => this.loaderService.hide()),
                    catchError(error => of(EpisodeActions.RequestNFailure({ error })))
                );
            })
        )
    );


    fetchFirstNEpisode$ = createEffect(
        () => this.actions$.pipe(
            ofType(EpisodeActions.FetchFirstNEpisode),
            tap(() => this.loaderService.show()),
            exhaustMap(action => {
                const { titleId } = action;
                return this.comicService.getFirstNEpisode(titleId).pipe(
                    map((firstEpisode: EpisodeDetail) => {
                        return EpisodeActions.SetFirstNEpisode({firstEpisode});
                    }),
                    tap(() => this.loaderService.hide()),
                    catchError(error => {
                        return of(EpisodeActions.RequestNFailure({error}));
                    })
                );
            })
        )
    );

    fetchDetailEpisode$ = createEffect(
        () => this.actions$.pipe(
            ofType(EpisodeActions.FetchDetailNEpisode),
            tap(() => this.loaderService.show()),
            exhaustMap(action => {
                const { episodeId } = action;
                return this.comicService.getNEpisodeDetail(episodeId).pipe(
                    map(detailEpisode => EpisodeActions.SetDetailNEpisode({ detailEpisode })),
                    tap(() => this.loaderService.hide()),
                    catchError(error => of(EpisodeActions.RequestNFailure({ error })))
                );
            })
        )
    );

    fetchEpisodes$ = createEffect(
        () => this.actions$.pipe(
            ofType(EpisodeActions.FetchNEpisodes),
            withLatestFrom(this.episodeStore$.pipe(select(fromEpisode.getNEpisodes))),
            tap(() => this.episodeStore$.dispatch(EpisodeActions.SetIsFetching({ isFetching: true }))),
            exhaustMap(([action, cachedEpisodes]) => {
                const { params } = action;
                const { list: cachedList } = cachedEpisodes;
                const { titleId, page, limit, sort } = params;
                return this.comicService.getNEpisodes({ user_id: parseInt(localStorage.getItem('user_id'), 10) || -1, id: titleId, page, limit, sort }).pipe(
                    map(res => {
                        const { list: nextList, total, page: nextPage } = res;
                        const list = page > 0 ? [ ...cachedList, ...nextList] : nextList;
                        const totalPage = this.utilsService.getTotalPage(total, limit);
                        const episodes = { list, total, page: nextPage, limit, totalPage };
                        return EpisodeActions.SetNEpisodes({ episodes });
                    }),
                    tap(() => this.episodeStore$.dispatch(EpisodeActions.SetIsFetching({ isFetching: false }))),
                    catchError(error => of(EpisodeActions.RequestNFailure({ error })))
                );
            })
        )
    );

}

