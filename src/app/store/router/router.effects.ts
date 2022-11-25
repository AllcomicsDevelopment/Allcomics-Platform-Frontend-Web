import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATED, ROUTER_REQUEST, RouterReducerState } from '@ngrx/router-store';

import { tap } from 'rxjs/operators';
import * as fromRouter from './router.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class RouterEffects {

    constructor(private actions$: Actions,
                private routerStore$: Store<RouterReducerState<fromRouter.RouterStateUrl>>) {
    }

    @Effect({ dispatch: false })
    startNavigation$ = this.actions$.pipe(
        ofType(ROUTER_REQUEST),
    );

    @Effect({ dispatch: false })
    endNavigation$ = this.actions$.pipe(
        ofType(ROUTER_NAVIGATED),
        tap(() => {
            window.scrollTo(0, 0);
        })
    );

    @Effect({ dispatch: false })
    cancelNavigation$ = this.actions$.pipe(
        ofType(ROUTER_CANCEL),
    );

    @Effect({ dispatch: false })
    errorNavigation$ = this.actions$.pipe(
        ofType(ROUTER_ERROR),
    );
}
