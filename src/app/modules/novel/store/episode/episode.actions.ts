import { createAction, props } from '@ngrx/store';
import { EpisodeDetail } from '@app/models/episode';

export const RequestNSuccess = createAction(
    '[NEPISODE] Request Success'
);

export const RequestNFailure = createAction(
    '[NEPISODE] Request Failure',
    props<{ error: any }>()
);

export const FetchTitleAndNEpisodes = createAction(
    '[NEPISODE] Fetch Title And NEpisodes',
    props<{ params: any }>()
);

export const SetTitleAndNEpisodes = createAction(
    '[NEPISODE] Set Title And Episodes',
    props<{ title: any, episodes: any }>()
);

export const FetchNEpisodes = createAction(
    '[NEPISODE] Fetch Episodes',
    props<{ params: any }>()
);

export const SetNEpisodes = createAction(
    '[NEPISODE] Set Episodes',
    props<{ episodes: any }>()
);

export const FetchFirstNEpisode = createAction(
    '[NEPISODE] Fetch First NEpisode',
    props<{ titleId: any }>()
);

export const SetFirstNEpisode = createAction(
    '[NEPISODE] Set First Episode',
    props<{ firstEpisode: EpisodeDetail }>()
);

export const FetchDetailNEpisode = createAction(
    '[NEPISODE] Fetch Detail Episode',
    props<{ episodeId: any }>()
);

export const SetDetailNEpisode = createAction(
    '[NEPISODE] Set Detail Episode',
    props<{ detailEpisode: any }>()
);

export const ResetNTitle = createAction(
    '[NEPISODE] Reset Title',
);

export const ResetNEpisodes = createAction(
    '[NEPISODE] Reset Episodes',
);

export const UpdateNEpisodesAfterPayment = createAction(
    '[NEPISODE] Update Episodes After Payment',
    props<{ episodeId: any }>()
);

export const SetIsFetching = createAction(
    '[NEPISODE] Set Is Fetching',
    props<{ isFetching: boolean }>()
);
