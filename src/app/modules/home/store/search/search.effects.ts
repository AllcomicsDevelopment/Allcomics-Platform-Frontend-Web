import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, tap, exhaustMap, withLatestFrom } from 'rxjs/operators';

import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import * as fromRouter from '../../../../store/router/router.reducer';

import * as SearchActions from './search.actions';
import * as fromSearch from './search.reducer';
import { SearchWebtoonList } from './search.reducer';

import { ComicService } from '@core/services/comic.service';
import { LoaderService } from '@core/services/loader.service';
import { UtilsService } from '@core/services/utils.service';

@Injectable()
export class SearchEffects {

    constructor(private actions$: Actions,
                private loaderService: LoaderService,
                private searchStore$: Store<fromSearch.State>,
                private routerStore$: Store<RouterReducerState<fromRouter.RouterStateUrl>>,
                private utilsService: UtilsService,
                private comicService: ComicService) {}

    requestFailure$ = createEffect(
        () => this.actions$.pipe(
            ofType(SearchActions.RequestFailure),
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
            ofType(SearchActions.FetchWebtoonList),
            withLatestFrom(this.searchStore$.pipe(select(fromSearch.getSearchedList))),
            tap(() => this.searchStore$.dispatch(SearchActions.SetIsFetching({ isFetching: true }))),
            exhaustMap(([action, storedList]) => {
                const { params } = action;
                return this.comicService.searchItem({ ...params }).pipe(
                    map(({ list: nextList, total, page, limit }) => {
                        const list = page > 0 ? [ ...storedList, ...nextList ] : nextList;
                        const totalPage = this.utilsService.getTotalPage(total, limit);
                        const res: SearchWebtoonList = { list, total, page, limit, totalPage };
                        return SearchActions.SetWebtoonList({ res });
                    }),
                    tap(() => this.searchStore$.dispatch(SearchActions.SetIsFetching({ isFetching: false }))),
                    catchError(error => of(SearchActions.RequestFailure({ error })))
                );
            })
        )
    );

}

