import {Action, createFeatureSelector, createReducer, createSelector, on} from '@ngrx/store';
import * as NovelActions from './novel.actions';
import {Banner, BannerItem} from '@app/models/banner';
import {Title} from '@app/models/title';

export const DEFAULT_LIMIT = 4;
export const DEFAULT_PAGE = 0;

export interface NovelList {
    list: any;
    total?: number;
    page?: number;
    count?: number;
    language?: string;
    sort?: string;
    totalPage?: number;
    isInit?: boolean;
    banner?: Banner;
}

export type NovelGenre = 'romance' | 'drama' | 'action' | 'fantasy' | 'blgl' | 'manga' | 'challenges';
export type NovelDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun' | 'com';

export interface State {
    slideBanner: Banner;
    banners: BannerItem[];

    romance: NovelList;
    drama: NovelList;
    action: NovelList;
    fantasy: NovelList;
    blgl: NovelList;
    manga: NovelList;  // 성인
    challenges: NovelList;  // 베스트
    activeGenre: NovelGenre;
    bannerList: Banner[];
    isFetching: boolean;

    rankings: Title[];
    completed: Title[];
    populars: Title[];
    millions: Title[];
    recentlyUpdated: Title[];

    activeDay: NovelDay;

    mon: NovelList;
    tue: NovelList;
    wed: NovelList;
    thu: NovelList;
    fri: NovelList;
    sat: NovelList;
    sun: NovelList;
    com: NovelList;
}

export const initialState: State = {
    slideBanner: null,
    banners: null,
    romance: { list: [], total: 0, page: DEFAULT_PAGE, count: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    drama: { list: [], total: 0, page: DEFAULT_PAGE, count: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    action: { list: [], total: 0, page: DEFAULT_PAGE, count: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    fantasy: { list: [], total: 0, page: DEFAULT_PAGE, count: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    blgl: { list: [], total: 0, page: DEFAULT_PAGE, count: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    manga: { list: [], total: 0, page: DEFAULT_PAGE, count: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    challenges: { list: [], total: 0, page: DEFAULT_PAGE, count: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    mon: { list: [], total: 0, page: DEFAULT_PAGE, count: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    tue: { list: [], total: 0, page: DEFAULT_PAGE, count: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    wed: { list: [], total: 0, page: DEFAULT_PAGE, count: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    thu: { list: [], total: 0, page: DEFAULT_PAGE, count: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    fri: { list: [], total: 0, page: DEFAULT_PAGE, count: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    sat: { list: [], total: 0, page: DEFAULT_PAGE, count: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    sun: { list: [], total: 0, page: DEFAULT_PAGE, count: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    com: { list: [], total: 0, page: DEFAULT_PAGE, count: DEFAULT_LIMIT, totalPage: DEFAULT_PAGE, isInit: false, banner: null },
    activeGenre: 'romance',
    bannerList: null,
    isFetching: false,
    rankings: null,
    completed: null,
    populars: null,
    millions: null,
    recentlyUpdated: null,
    activeDay: 'mon',
};

export const _novelReducer = createReducer(
    initialState,
    on(NovelActions.SetSlideBanner, (state, { slideBanner }) => ({
        ...state,
        slideBanner,
    })),
    on(NovelActions.SetActiveGenre, (state, {genre}) => ({
        ...state,
        activeGenre: genre
    })),
    on(NovelActions.SetActiveDay, (state, { day }) => ({
        ...state,
        activeGenre: day
    })),
    on(NovelActions.SetNovelList, (state, { day, res }) => {
        const { list, total, page, count, language, sort } = res;
        state[day] = { list, total, page, count, language, sort, isInit: true, banner: state[day].banner };
        return { ...state };
    }),
    on(NovelActions.SetIsFetching, (state, { isFetching }) => ({
        ...state,
        isFetching
    })),
    on(NovelActions.SetRankings, (state, { rankings }) => ({
        ...state,
        rankings,
    })),
    on(NovelActions.SetCompleted, (state, { completed }) => ({
        ...state,
        completed,
    })),
    on(NovelActions.SetPopulars, (state, { populars }) => ({
        ...state,
        populars,
    })),
    on(NovelActions.SetMillions, (state, { millions }) => ({
        ...state,
        millions,
    })),
    on(NovelActions.SetRecents, (state, { recentlyUpdated }) => ({
        ...state,
        recentlyUpdated,
    })),
);

export function novelReducer(state: State | undefined, action: Action) {
    return _novelReducer(state, action);
}

const selectNovel = createFeatureSelector<State>('novel');

export const getBanners = createSelector(selectNovel, (state: State) => state.banners);
export const getSlideBanner = createSelector(selectNovel, (state: State) => state.slideBanner);

export const getActiveGenreAndNovel = createSelector(selectNovel, (state: State) => {
    const genre = state.activeGenre;
    return { genre, novel: state[genre] };
});
export const getActiveDayAndNovel = createSelector(selectNovel, (state: State) => {
    const day = state.activeDay;
    return { day, novel: state[day] };
});
export const getActiveNovelList = createSelector(selectNovel, (state: State) => state[state.activeDay].list);
export const getActiveNovelIsInit = createSelector(selectNovel, (state: State) => state[state.activeDay].isInit);
export const getActiveGenre = createSelector(selectNovel, (state: State) => state.activeGenre);
export const getActiveDay = createSelector(selectNovel, (state: State) => state.activeDay);

export const getRankings = createSelector(selectNovel, (state: State) => state.rankings);
export const getCompleted = createSelector(selectNovel, (state: State) => state.completed);
export const getPopulars = createSelector(selectNovel, (state: State) => state.populars);
export const getMillions = createSelector(selectNovel, (state: State) => state.millions);
export const getRecentlyUpdated = createSelector(selectNovel, (state: State) => state.recentlyUpdated);
