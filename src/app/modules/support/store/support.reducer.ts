import { createReducer, on, Action, createFeatureSelector, createSelector } from '@ngrx/store';
import * as SupportActions from './support.actions';
import { Message, Category } from '@app/models/message';

export interface MessageList {
    list: Message[];
    total: number;
    totalPage: number;
    page: number;
}

export interface State {
    inquiry: MessageList;
    faq: MessageList;
    notice: MessageList;
    activeCategory: Category;
    isFetching: boolean;
}

export const initialState: State = {
    inquiry: { list: [], total: 0, totalPage: 0, page: 0 },
    faq: { list: [], total: 0, totalPage: 0, page: 0 },
    notice: { list: [], total: 0, totalPage: 0, page: 0 },
    activeCategory: 'notice',
    isFetching: false,
};

export const _supportReducer = createReducer(
    initialState,
    on(SupportActions.RequestSuccess, (state) => ({
        ...state,
    })),
    on(SupportActions.SetFaqList, (state, { list, total, totalPage, page }) => ({
        ...state,
        faq: { list, total, totalPage, page },
    })),
    on(SupportActions.SetInquiryList, (state, { list, total, totalPage, page }) => ({
        ...state,
        inquiry: { list, total, totalPage, page },
    })),
    on(SupportActions.SetNoticeList, (state, { list, total, totalPage, page }) => ({
        ...state,
        notice: { list, total, totalPage, page },
    })),
    on(SupportActions.ResetMessageList, (state) => ({
        ...state,
        inquiry: null,
        faq: null,
        notice: null,
    })),
    on(SupportActions.SetIsFetching, (state, { isFetching }) => ({
        ...state,
        isFetching,
    })),
    on(SupportActions.SetActiveCategory, (state, { category }) => ({
        ...state,
        activeCategory: category,
    })),
);

export function supportReducer(state: State | undefined, action: Action) {
    return _supportReducer(state, action);
}

const selectSupport = createFeatureSelector<State>('support');
export const getInquiryList = createSelector(selectSupport, (state: State) => state.inquiry);
export const getFaqList = createSelector(selectSupport, (state: State) => state.faq);
export const getNoticeList = createSelector(selectSupport, (state: State) => state.notice);
export const getActiveCategory = createSelector(selectSupport, (state: State) => state.activeCategory);
export const getActivePage = createSelector(selectSupport, (state: State) => state[state.activeCategory].page);
export const getActiveTotalPage = createSelector(selectSupport, (state: State) => state[state.activeCategory].totalPage);
export const getIsFetching = createSelector(selectSupport, (state: State) => state.isFetching);

