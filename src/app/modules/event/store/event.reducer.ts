import { createReducer, on, Action, createFeatureSelector, createSelector } from '@ngrx/store';
import * as EventActions from './event.actions';

import { Banner } from '@app/models/banner';
import { Title } from '@app/models/title';

export interface State {
    // banners
    bannersTotal: number;
    banners: Banner[];
    eventMainBanner: Banner;
    eventInfoBanner: Banner;
    eventFreeBanner: Banner;
    // titles
    rankings: Title[];
    populars: Title[];
    completed: Title[];
}

export const initialState: State = {
    // banners
    bannersTotal: null,
    banners: null,
    eventMainBanner: null,
    eventInfoBanner: null,
    eventFreeBanner: null,
    // titles
    rankings: null,
    populars: null,
    completed: null,
};

export const _eventReducer = createReducer(
    initialState,

    // banners
    on(EventActions.SetBannerList, (state, { total, list }) => ({
        ...state,
        bannersTotal: total,
        banners: list,
    })),
    on(EventActions.SetEventMainBanner, (state, { eventMainBanner }) => ({
        ...state,
        eventMainBanner,
    })),
    on(EventActions.SetEventInfoBanner, (state, { eventInfoBanner }) => ({
        ...state,
        eventInfoBanner,
    })),
    on(EventActions.SetEventFreeBanner, (state, { eventFreeBanner }) => ({
        ...state,
        eventFreeBanner,
    })),
    // titles
    on(EventActions.SetRankings, (state, { rankings }) => ({
        ...state,
        rankings,
    })),
    on(EventActions.SetPopulars, (state, { populars }) => ({
        ...state,
        populars,
    })),
    on(EventActions.SetCompleted, (state, { completed }) => ({
        ...state,
        completed,
    })),
    on(EventActions.RequestSuccess, (state) => ({
        ...state,
    })),
);

export function eventReducer(state: State | undefined, action: Action) {
    return _eventReducer(state, action);
}

const selectEvent = createFeatureSelector<State>('event');
// banners
export const getEventBanners = createSelector(selectEvent, (state: State) => state.banners);
export const getEventMainBanner = createSelector(selectEvent, (state: State) => state.eventMainBanner);
export const getEventInfoBanner = createSelector(selectEvent, (state: State) => state.eventInfoBanner);
export const getEventFreeBanner = createSelector(selectEvent, (state: State) => state.eventFreeBanner);
// titles
export const getRankings = createSelector(selectEvent, (state: State) => state.rankings);
export const getPopulars = createSelector(selectEvent, (state: State) => state.populars);
export const getCompleted = createSelector(selectEvent, (state: State) => state.completed);
