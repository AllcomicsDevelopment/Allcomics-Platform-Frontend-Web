import { createReducer, on, Action, createFeatureSelector, createSelector } from '@ngrx/store';
import * as RootActions from './root.actions';
import { Banner } from '@app/models/banner';

export interface State {
    deviceInfo: any;
    platform: string;
    profile: any;
    myPageBanner: Banner;
    appVersion: string;
}

export const initialState: State = {
    deviceInfo: null,
    platform: null,
    profile: null,
    myPageBanner: null,
    appVersion: '0.0.0',
};

export const _rootReducer = createReducer(
    initialState,
    on(RootActions.SetDeviceInfo, (state, { deviceInfo }) => ({
        ...state,
        deviceInfo,
    })),
    on(RootActions.SetDevicePlatform, (state, { platform }) => ({
        ...state,
        platform
    })),
    on(RootActions.SetProfile, (state, { profile }) => ({
        ...state,
        profile,
    })),
    on(RootActions.SetMyPageBanner, (state, { myPageBanner }) => ({
        ...state,
        myPageBanner,
    })),
    on(RootActions.ResetProfile, state => ({
        ...state,
        profile: null
    })),
    on(RootActions.SetAppVersion, (state, { appVersion }) => ({
        ...state,
        appVersion
    })),
);

export function rootReducer(state: State | undefined, action: Action) {
    return _rootReducer(state, action);
}

const selectRoot = createFeatureSelector<State>('root');
export const getDeviceInfo = createSelector(selectRoot, (state: State) => state.deviceInfo);
export const getDevicePlatform = createSelector(selectRoot, (state: State) => state.platform);
export const getProfile = createSelector(selectRoot, (state: State) => state.profile);
export const getMyPageBanner = createSelector(selectRoot, (state: State) => state.myPageBanner);
export const getAppVersion = createSelector(selectRoot, (state: State) => state.appVersion);
