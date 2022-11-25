import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as EpisodeActions from './episode.actions';
import { EpisodeDetail } from '@app/models/episode';

export interface EpisodeList {
    list: any;
    total: number;
    page: number;
    limit: number;
    totalPage: number;
}

export interface State {
    title: any;
    firstEpisode: EpisodeDetail;
    episodes: EpisodeList;
    detailEpisode: any; // TODO: defint interface
    isFetching: boolean;
}

export const initialState: State = {
    title: null,
    firstEpisode: null,
    episodes: { list: [], total: 0, page: 0, limit: 10, totalPage: 0 },
    detailEpisode: null,
    isFetching: false,
};

export const _episodeReducer = createReducer(
    initialState,
    on(EpisodeActions.RequestNSuccess, (state) => ({
        ...state,
    })),
    on(EpisodeActions.SetFirstNEpisode, (state, { firstEpisode }) => ({
        ...state,
        firstEpisode
    })),
    on(EpisodeActions.SetTitleAndNEpisodes, (state, { title, episodes }) => ({
        ...state,
        title,
        episodes
    })),
    on(EpisodeActions.SetNEpisodes, (state, { episodes }) => ({
        ...state,
        episodes
    })),
    on(EpisodeActions.ResetNEpisodes, state => ({
        ...state,
        firstEpisode: null,
        episodes:  { list: [], total: 0, page: 0, limit: 10, totalPage: 0 }
    })),
    on(EpisodeActions.ResetNTitle, state => ({
        ...state,
        title: null
    })),
    on(EpisodeActions.UpdateNEpisodesAfterPayment, (state, { episodeId }) => ({
        ...state,
        episodes: {
            ...state.episodes,
            list: state.episodes.list.map(episode => {
                if (episode.id === episodeId) {
                    episode.isPurchased = true;
                }
                return episode;
            })
        }
    })),
    on(EpisodeActions.SetDetailNEpisode, (state, { detailEpisode }) => ({
        ...state,
        detailEpisode
    })),
    on(EpisodeActions.SetIsFetching, (state, { isFetching }) => ({
        ...state,
        isFetching
    })),
);

export function episodeReducer(state: State | undefined, action: Action) {
    return _episodeReducer(state, action);
}

const selectEpisode = createFeatureSelector<State>('nepisode');
export const getNTitle = createSelector(selectEpisode, (state: State) => state.title);
export const getFirstNEpisode = createSelector(selectEpisode, (state: State) => state.firstEpisode);
export const getNEpisodes = createSelector(selectEpisode, (state: State) => state.episodes);
export const getDetailNEpisode = createSelector(selectEpisode, (state: State) => state.detailEpisode);
export const getIsNFetching = createSelector(selectEpisode, (state: State) => state.isFetching);
