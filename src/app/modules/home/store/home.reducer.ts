import { createReducer, on, Action, createFeatureSelector, createSelector } from '@ngrx/store';
import * as HomeActions from './home.actions';

import {Banner, BannerItem} from '@app/models/banner';
import { Title } from '@app/models/title';

export type WebtoonDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun' | 'com';

export interface State {
    // banners
    bannerCount: string;
    banners: BannerItem[];
    slideBanner: Banner;
    // bottomAdsBanner: Banner;
    // goodsBanner: Banner;
    // titles
    weeks: Title[];
    activeDay: WebtoonDay;
    rankings: Title[];
    populars: Title[];
    recentlyUpdated: Title[];
    romance: Title[];
    completed: Title[];
}

export const initialState: State = {
    // banners
    bannerCount: null,
    banners: null,
    slideBanner: null,
    // bottomAdsBanner: null,
    // goodsBanner: null,
    // titles
    weeks: null,
    activeDay: 'mon',
    rankings: null,
    populars: null,
    recentlyUpdated: null,
    romance: null,
    completed: null,
};

export const _homeReducer = createReducer(
    initialState,

    // banners
    on(HomeActions.SetBannerList, (state, { count, list }) => ({
        ...state,
        bannerCount: count,
        banners: list,
    })),
    on(HomeActions.SetSlideBanner, (state, { slideBanner }) => ({
        ...state,
        slideBanner,
    })),
    on(HomeActions.SetBottomAdsBanner, (state, { bottomAdsBanner }) => ({
        ...state,
        bottomAdsBanner,
    })),
    on(HomeActions.SetGoodsBanner, (state, { goodsBanner }) => ({
        ...state,
        goodsBanner,
    })),
    // titles
    on(HomeActions.SetWeeks, (state, { weeks }) => ({
        ...state,
        weeks,
    })),
    on(HomeActions.SetActiveDay, (state, { day }) => ({
        ...state,
        activeDay: day
    })),
    on(HomeActions.SetRankings, (state, { rankings }) => ({
        ...state,
        rankings,
    })),
    on(HomeActions.SetPopulars, (state, { populars }) => ({
        ...state,
        populars,
    })),
    on(HomeActions.SetRecentlyUpdated, (state, { recentlyUpdated }) => ({
        ...state,
        recentlyUpdated,
    })),
    on(HomeActions.SetRomance, (state, { romance }) => ({
        ...state,
        romance,
    })),
    on(HomeActions.SetCompleted, (state, { completed }) => ({
        ...state,
        completed,
    })),
    on(HomeActions.RequestSuccess, (state) => ({
        ...state,
    })),
);

export function homeReducer(state: State | undefined, action: Action) {
    return _homeReducer(state, action);
}

const selectHome = createFeatureSelector<State>('home');
// banners
export const getBanners = createSelector(selectHome, (state: State) => state.banners);
export const getSlideBanner = createSelector(selectHome, (state: State) => state.slideBanner);
// export const getBottomAdsBanner = createSelector(selectHome, (state: State) => state.bottomAdsBanner);
// export const getGoodsBanner = createSelector(selectHome, (state: State) => state.goodsBanner);
// titles
export const getWeeks = createSelector(selectHome, (state: State) => state.weeks);
export const getActiveDay = createSelector(selectHome, (state: State) => state.activeDay);
export const getRankings = createSelector(selectHome, (state: State) => state.rankings);
export const getPopulars = createSelector(selectHome, (state: State) => state.populars);
export const getRecentlyUpdated = createSelector(selectHome, (state: State) => state.recentlyUpdated);
export const getRomance = createSelector(selectHome, (state: State) => state.romance);
export const getCompleted = createSelector(selectHome, (state: State) => state.completed);
