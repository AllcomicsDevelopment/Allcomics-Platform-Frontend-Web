import { createAction, props } from '@ngrx/store';
import { WebtoonGenre, WebtoonList } from '@app/modules/novel/store/webtoon/webtoon.reducer';
import { Banner } from '@app/models/banner';

export const RequestNSuccess = createAction(
    '[NOVEL] Request Success'
);

export const RequestNFailure = createAction(
    '[NOVEL] Request Failure',
    props<{ error: any }>()
);

export const FetchNovelList = createAction(
    '[NOVEL] Fetch Webtoon List',
    props<{ params: any }>()
);

export const SetNovelList = createAction(
    '[NOVEL] Set Webtoon List',
    props<{ genre: WebtoonGenre, res: WebtoonList }>()
);

export const SetNActiveGenre = createAction(
    '[NOVEL] Set Active Genre',
    props<{ genre: string }>()
);

export const FetchNGenresBannerList = createAction(
    '[NOVEL] Fetch Genres Banner List',
    props<{ params: any, category: string }>()
);

export const SetNGenresBannerList = createAction(
    '[NOVEL] Set Genres Banner List',
    props<{ total: number, list: Banner[] }>()
);

export const FetchNActiveGenreBanner = createAction(
    '[NOVEL] Fetch Banner By Genre',
    props<{ bannerId: string }>()
);

export const SetNActiveGenreBanner = createAction(
    '[NOVEL] Set Active Genre Banner',
    props<{ genre: string, banner: Banner }>()
);

export const SetIsNFetching = createAction(
    '[NOVEL] Set Is Fetching',
    props<{ isFetching: boolean }>()
);
