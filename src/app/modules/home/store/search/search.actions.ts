import { createAction, props } from '@ngrx/store';
import { SearchWebtoonList } from '@app/modules/home/store/search/search.reducer';

export const RequestSuccess = createAction(
    '[SEARCH] Request Success'
);

export const RequestFailure = createAction(
    '[SEARCH] Request Failure',
    props<{ error: any }>()
);

export const FetchWebtoonList = createAction(
    '[SEARCH] Fetch Webtoon List',
    props<{ params: any }>()
);

export const SetWebtoonList = createAction(
    '[SEARCH] Set Webtoon List',
    props<{ res: SearchWebtoonList }>()
);

export const SetIsFetching = createAction(
    '[SEARCH] Set Is Fetching',
    props<{ isFetching: boolean }>()
);
