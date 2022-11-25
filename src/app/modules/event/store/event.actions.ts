import { createAction, props } from '@ngrx/store';
import { Banner } from '@app/models/banner';
import { Title } from '@app/models/title';

export const FetchBannerList = createAction(
    '[EVENT] Fetch Banner List',
    props<{ params: any, category: string }>()
);

export const SetBannerList = createAction(
    '[EVENT] Set Banner List',
    props<{ total: number, list: Banner[] }>()
);

export const FetchEventMainBanner = createAction(
    '[EVENT] Fetch Event Main Banner',
    props<{ eventMainBannerId: string }>()
);

export const SetEventMainBanner = createAction(
    '[EVENT] Set Event Main Banner',
    props<{ eventMainBanner: Banner }>()
);

export const FetchEventInfoBanner = createAction(
    '[EVENT] Fetch Event Info Banner',
    props<{ eventInfoBannerId: string }>()
);

export const SetEventInfoBanner = createAction(
    '[EVENT] Set Event Info Banner',
    props<{ eventInfoBanner: Banner }>()
);

export const FetchEventFreeBanner = createAction(
    '[EVENT] Fetch Event Free Banner',
    props<{ eventFreeBannerId: string }>()
);

export const SetEventFreeBanner = createAction(
    '[EVENT] Set Event Free Banner',
    props<{ eventFreeBanner: Banner }>()
);

// Titles
export const FetchRankings = createAction(
    '[EVENT] Fetch Rankings',
    props<{ params: { limit: number, page: number, sort: string, order: string } }>()
);

export const SetRankings = createAction(
    '[EVENT] Set Rankings',
    props<{ rankings: Title[] }>()
);

export const FetchPopulars = createAction(
    '[EVENT] Fetch Populars',
    props<{ params: { keyword: string } }>()
);

export const SetPopulars = createAction(
    '[EVENT] Set Populars',
    props<{ populars: Title[] }>()
);

export const FetchCompleted = createAction(
    '[EVENT] Fetch Completed',
    props<{ params: { keyword: string } }>()
);

export const SetCompleted = createAction(
    '[EVENT] Set Completed',
    props<{ completed: Title[] }>()
);

export const RequestSuccess = createAction(
    '[EVENT] Request Success'
);

export const RequestFailure = createAction(
    '[EVENT] Request Failure',
    props<{ error: any }>()
);
