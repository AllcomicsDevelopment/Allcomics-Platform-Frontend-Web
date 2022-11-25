import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';

import { WINDOW } from '@core/services/window.service';

import { of } from 'rxjs';
import { catchError, map, tap, exhaustMap, withLatestFrom, filter } from 'rxjs/operators';

import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';

import * as RootActions from '@app/store/root/root.actions';
import * as fromRouter from '../../../store/router/router.reducer';

import * as PaymentActions from './payment.actions';
import * as fromPayment from './payment.reducer';

import { ComicService } from '@core/services/comic.service';
import { LoaderService } from '@core/services/loader.service';
import { UtilsService } from '@core/services/utils.service';

import * as fromRoot from '@app/store/root/root.reducer';
import * as MyPageActions from '@app/modules/my-page/store/my-page.actions';

@Injectable()
export class PaymentEffects {

    constructor(private actions$: Actions,
                private loaderService: LoaderService,
                private utilsService: UtilsService,
                private router: Router,
                @Inject(WINDOW) private window: Window,
                private rootStore$: Store<fromRoot.State>,
                private paymentStore$: Store<fromPayment.State>,
                private routerStore$: Store<RouterReducerState<fromRouter.RouterStateUrl>>,
                private comicService: ComicService) {}

    requestFailure$ = createEffect(
        () => this.actions$.pipe(
            ofType(PaymentActions.RequestFailure),
            map(action => action.error),
            tap(() => this.loaderService.hide()),
            tap(error => {
                const errorMessage = error['message'] || error['statusText'] || error;
                alert(`Error! ${errorMessage}`);
            }),
        ),
        { dispatch: false }
    );

    // KCP 방식
    chargeTDN$ = createEffect(
        () => this.actions$.pipe(
            ofType(PaymentActions.ChargeTDN),
            tap(() => this.loaderService.show()),
            exhaustMap(action => {
                const { data } = action; // { ngReturn } = data;
                return this.comicService.chargeTDN({ ...data }).pipe(
                    tap((res) => {
                        // console.log(res);
                        this.window.location.replace('/home');
                    }),
                    // tap(({ merchantUrl }) => this.window.location.replace(merchantUrl)),
                    tap(() => this.loaderService.hide()),
                    catchError(error => of(RootActions.RequestFailure({ error })))
                );
            })
        ),
        { dispatch: false }
    );

    chargeTDNDirectly$ = createEffect(
        () => this.actions$.pipe(
            ofType(PaymentActions.ChargeTDNDirectly),
            withLatestFrom(this.paymentStore$.pipe(select(fromPayment.getToChargeData), filter(data => !!data))),
            tap(() => this.loaderService.show()),
            exhaustMap(([action, data]) => {
                return this.comicService.chargeTDN({ ...data }).pipe(
                    tap(() => this.loaderService.hide()),
                    tap(res => {
                        const { returnUrl } = res.data.data;
                        const [host, path] = returnUrl.split(/\/(.+)/);
                        this.router.navigateByUrl(`/${path}`);
                    }),
                    catchError(error => of(RootActions.RequestFailure({ error })))
                );
            })
        ),
        { dispatch: false }
    );

    fetchTDNHistory$ = createEffect(
        () => this.actions$.pipe(
            ofType(PaymentActions.FetchTDNHistory),
            withLatestFrom(this.paymentStore$.pipe(select(fromPayment.getTdnHistory))),
            tap(() => this.paymentStore$.dispatch(PaymentActions.SetIsFetching({ isFetching: true }))),
            exhaustMap(([action, cachedHistory]) => {
                const { params } = action;
                const { list: cachedList } = cachedHistory;
                const { page, limit } = params;
                const sort = params.sort || '!createdAt';
                return this.comicService.getTDNHistory$({ page, limit, sort }).pipe(
                    map(res => {
                        const { list: nextList, total, page: nextPage } = res;
                        const list = page > 0 ? [ ...cachedList, ...nextList] : nextList;
                        const totalPage = this.utilsService.getTotalPage(total, limit);
                        const tdnHistory = { list, total, page: nextPage, limit, totalPage };
                        return PaymentActions.SetTDNHistory({ tdnHistory });
                    }),
                    map(res => {
                       return res;
                    }),
                    tap(() => this.paymentStore$.dispatch(PaymentActions.SetIsFetching({ isFetching: false }))),
                    catchError(error => of(MyPageActions.RequestFailure({ error })))
                );
            })
        )
    );

}

