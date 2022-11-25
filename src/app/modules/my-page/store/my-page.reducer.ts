import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as MyPageActions from './my-page.actions';

export interface FavoriteList {
    list: any[];
    total: number;
    page: number;
    limit: number;
    totalPage: number;
}

export interface PurchasedList {
    list: any[];
    total: number;
    page: number;
    limit: number;
    totalPage: number;
}

export interface RecentlyViewedList {
    list: any[];
    total: number;
    page: number;
    limit: number;
    totalPage: number;
}

export interface State {
    favorites: FavoriteList;
    purchased: PurchasedList;
    recentlyViewed: RecentlyViewedList;
    isFetching: boolean;
}

export const initialState: State = {
    favorites: { list: [], total: 0, page: 0, limit: 10, totalPage: 0 },
    purchased: { list: [], total: 0, page: 0, limit: 10, totalPage: 0 },
    recentlyViewed: { list: [], total: 0, page: 0, limit: 10, totalPage: 0 },
    isFetching: false,
};

export const _myPageReducer = createReducer(
    initialState,
    on(MyPageActions.RequestSuccess, (state) => ({
        ...state,
    })),
    on(MyPageActions.SetFavorites, (state, { favorites }) => ({
        ...state,
        favorites
    })),
    on(MyPageActions.SetRecentlyViewed, (state, { recentlyViewed }) => ({
        ...state,
        recentlyViewed
    })),
    on(MyPageActions.SetPurchased, (state, { purchased }) => ({
        ...state,
        purchased
    })),
    on(MyPageActions.ResetFavorites, state => ({
        ...state,
        favorites: { list: [], total: 0, page: 0, limit: 10, totalPage: 0 }
    })),
    on(MyPageActions.ResetPurchased, state => ({
        ...state,
        purchased: { list: [], total: 0, page: 0, limit: 10, totalPage: 0 }
    })),
    on(MyPageActions.ResetRecentlyViewed, state => ({
        ...state,
        recentlyViewed: { list: [], total: 0, page: 0, limit: 10, totalPage: 0 }
    })),
    on(MyPageActions.SetIsFetching, (state, { isFetching }) => ({
        ...state,
        isFetching
    })),
);

export function myPageReducer(state: State | undefined, action: Action) {
    return _myPageReducer(state, action);
}

const selectMyPage = createFeatureSelector<State>('my-page');
export const getFavorites = createSelector(selectMyPage, (state: State) => state.favorites);
export const getRecentlyViewed = createSelector(selectMyPage, (state: State) => state.recentlyViewed);
export const getPurchased = createSelector(selectMyPage, (state: State) => state.purchased);
export const getIsFetching = createSelector(selectMyPage, (state: State) => state.isFetching);
