import { createAction, props } from '@ngrx/store';
import { WebtoonGenre, WebtoonList } from '@app/modules/webtoon/store/webtoon/webtoon.reducer';
import { Banner } from '@app/models/banner';

export const RequestSuccess = createAction(
    '[WEBTOON] Request Success'
);

export const RequestFailure = createAction(
    '[WEBTOON] Request Failure',
    props<{ error: any }>()
);

export const FetchWebtoonList = createAction(
    '[WEBTOON] Fetch Webtoon List',
    props<{ params: any }>()
);

export const SetWebtoonList = createAction(
    '[WEBTOON] Set Webtoon List',
    props<{ genre: WebtoonGenre, res: WebtoonList }>()
);

export const SetActiveGenre = createAction(
    '[WEBTOON] Set Active Genre',
    props<{ genre: string }>()
);

export const FetchGenresBannerList = createAction(
    '[WEBTOON] Fetch Genres Banner List',
    props<{ params: any, category: string }>()
);

export const SetGenresBannerList = createAction(
    '[WEBTOON] Set Genres Banner List',
    props<{ total: number, list: Banner[] }>()
);

export const FetchActiveGenreBanner = createAction(
    '[WEBTOON] Fetch Banner By Genre',
    props<{ bannerId: string }>()
);

export const SetActiveGenreBanner = createAction(
    '[WEBTOON] Set Active Genre Banner',
    props<{ genre: string, banner: Banner }>()
);

export const SetIsFetching = createAction(
    '[WEBTOON] Set Is Fetching',
    props<{ isFetching: boolean }>()
);
