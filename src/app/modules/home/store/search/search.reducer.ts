import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as SearchActions from './search.actions';

export const DEFAULT_LIMIT = 10;
export const DEFAULT_PAGE = 0;
export const DEFAULT_TOTAL_PAGE = 0;

export interface SearchWebtoonList {
    limit: number;
    list: any[];
    page: number;
    totalPage: number;
    total: number;
}

export interface State {
    searched: SearchWebtoonList;
    isFetching: boolean;
}

export const initialState: State = {
    searched: {
        list: [],
        page: DEFAULT_PAGE,
        limit: DEFAULT_LIMIT,
        totalPage: DEFAULT_TOTAL_PAGE,
        total: 0,
    },
    isFetching: false,
};

export const _searchReducer = createReducer(
    initialState,
    on(SearchActions.RequestSuccess, (state) => ({
        ...state,
    })),
    on(SearchActions.SetWebtoonList, (state, { res: searched }) => {
        return { ...state, searched };
    }),
    on(SearchActions.SetIsFetching, (state, { isFetching }) => ({
        ...state,
        isFetching
    })),
);

export function searchReducer(state: State | undefined, action: Action) {
    return _searchReducer(state, action);
}

const selectSearch = createFeatureSelector<State>('search');
export const getSearchedList = createSelector(selectSearch, (state: State) => state.searched.list);
export const getSearchedTotal = createSelector(selectSearch, (state: State) => state.searched.total);
export const getSearchedTotalPage = createSelector(selectSearch, (state: State) => state.searched.totalPage);
export const getSearchedLimit = createSelector(selectSearch, (state: State) => state.searched.limit);
export const getSearchedPage = createSelector(selectSearch, (state: State) => state.searched.page);
export const getIsFetching = createSelector(selectSearch, (state: State) => state.isFetching);
