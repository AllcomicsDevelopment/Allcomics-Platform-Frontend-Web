import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';
import { Params, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

export interface RouterStateUrl {
    url: string;
    params: Params;
    queryParams: Params;
    fragmentObj: object;
}

@Injectable()
export class RouterSerializer implements RouterStateSerializer<RouterStateUrl> {

    serialize(routerState: RouterStateSnapshot): RouterStateUrl {
        let route = routerState.root;
        while (route.firstChild) {
            route = route.firstChild;
        }

        const { url, root: { queryParams } } = routerState;
        const { params, fragment } = route;
        const fragmentObj = this.convertHashParameter(fragment);

        return { url, params, queryParams, fragmentObj };
    }

    convertHashParameter(fragment: string) {
        const result = {};
        try {
            fragment.split('&').forEach(item => {
                const [key, value] = item.split('=');
                result[key] = decodeURIComponent(value || '');
            });
            return result;
        } catch {
            return {};
        }
    }
}

// Reducer selectors
export const selectReducerState = createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');
export const getRouterInfo = createSelector(selectReducerState, state => state.state);
export const getQueryParams = createSelector(selectReducerState, state => state && state.state && state.state.queryParams);
export const getRouterPage = createSelector(selectReducerState, state => state && state.state && state.state.queryParams && state.state.queryParams.page);
