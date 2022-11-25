import { createAction, props } from '@ngrx/store';
import { EpisodeDetail } from '@app/models/episode';

export const RequestSuccess = createAction(
    '[EPISODE] Request Success'
);

export const RequestFailure = createAction(
    '[EPISODE] Request Failure',
    props<{ error: any }>()
);

export const FetchTitleAndEpisodes = createAction(
    '[EPISODE] Fetch Title And Episodes',
    props<{ params: any }>()
);

export const SetTitleAndEpisodes = createAction(
    '[EPISODE] Set Title And Episodes',
    props<{ title: any, episodes: any }>()
);

export const FetchEpisodes = createAction(
    '[EPISODE] Fetch Episodes',
    props<{ params: any }>()
);

export const SetEpisodes = createAction(
    '[EPISODE] Set Episodes',
    props<{ episodes: any }>()
);

export const FetchFirstEpisode = createAction(
    '[EPISODE] Fetch First Episode',
    props<{ titleId: any }>()
);

export const SetFirstEpisode = createAction(
    '[EPISODE] Set First Episode',
    props<{ firstEpisode: EpisodeDetail }>()
);

export const FetchDetailEpisode = createAction(
    '[EPISODE] Fetch Detail Episode',
    props<{ episodeId: any }>()
);

export const SetDetailEpisode = createAction(
    '[EPISODE] Set Detail Episode',
    props<{ detailEpisode: any }>()
);

export const ResetTitle = createAction(
    '[EPISODE] Reset Title',
);

export const ResetEpisodes = createAction(
    '[EPISODE] Reset Episodes',
);

export const UpdateEpisodesAfterPayment = createAction(
    '[EPISODE] Update Episodes After Payment',
    props<{ episodeId: any }>()
);

export const SetIsFetching = createAction(
    '[EPISODE] Set Is Fetching',
    props<{ isFetching: boolean }>()
);
