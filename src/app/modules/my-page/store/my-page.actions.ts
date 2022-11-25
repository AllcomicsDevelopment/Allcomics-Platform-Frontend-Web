import { createAction, props } from '@ngrx/store';

export const RequestSuccess = createAction(
    '[MY_PAGE] Request Success'
);

export const RequestFailure = createAction(
    '[MY_PAGE] Request Failure',
    props<{ error: any }>()
);

export const FetchFavorites = createAction(
    '[MY_PAGE] Fetch Favorites',
    props<{ params: any }>()
);

export const SetFavorites = createAction(
    '[MY_PAGE] Set Favorites',
    props<{ favorites: any }>()
);

export const FetchPurchased = createAction(
    '[MY_PAGE] Fetch Purchased',
    props<{ params: any }>()
);

export const SetPurchased = createAction(
    '[MY_PAGE] Set Purchased',
    props<{ purchased: any }>()
);

export const FetchRecentlyViewed = createAction(
    '[MY_PAGE] Fetch Recently Viewed',
    props<{ params: any }>()
);

export const SetRecentlyViewed = createAction(
    '[MY_PAGE] Set Recently Viewed',
    props<{ recentlyViewed: any }>()
);

export const ResetFavorites = createAction(
    '[MY_PAGE] Reset Favorites',
);

export const ResetRecentlyViewed = createAction(
    '[MY_PAGE] Reset Recently Viewed',
);

export const ResetPurchased = createAction(
    '[MY_PAGE] Reset Purchased',
);

export const SetIsFetching = createAction(
    '[MY_PAGE] Set Is Fetching',
    props<{ isFetching: boolean }>()
);
