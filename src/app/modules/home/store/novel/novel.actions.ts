import {createAction, props} from '@ngrx/store';
import {NovelDay, NovelGenre, NovelList} from './novel.reducer';
import {Banner} from '@app/models/banner';
import {Title} from '@app/models/title';

export const RequestFailure = createAction(
    '[NOVEL] Request Failure',
    props<{ error: any }>()
);

export const FetchBannerList = createAction(
    '[NOVEL] Fetch Banner List',
    props<{ params: any }>()
);

export const SetSlideBanner = createAction(
    '[NOVEL] Set Slide Banner',
    props<{ slideBanner: Banner }>()
);

export const SetActiveGenre = createAction(
    '[NOVEL] Set Active Genre',
    props<{ genre: string }>()
);

export const SetActiveDay = createAction(
    '[NOVEL] Set Active Genre',
    props<{ day: string }>()
);

export const FetchGenresBannerList = createAction(
    '[NOVEL] Fetch Genres Banner List',
    props<{ params: any, category: string }>()
);

export const FetchNovelList = createAction(
    '[NOVEL] Fetch Novel List',
    props<{ params: any }>()
);

export const SetNovelList = createAction(
    '[NOVEL] Set NOVEL List',
    props<{ day: NovelDay, res: NovelList }>()
);

export const SetIsFetching = createAction(
    '[NOVEL] Set Is Fetching',
    props<{ isFetching: boolean }>()
);

export const FetchRankings = createAction(
    '[NOVEL] Fetch Rankings',
    props<{ params: { keyword: string } }>()
);

export const SetRankings = createAction(
    '[NOVEL] Set Rankings',
    props<{ rankings: Title[] }>()
);

export const FetchCompleted = createAction(
    '[NOVEL] Fetch Completed',
    props<{ params: { keyword: string } }>()
);

export const SetCompleted = createAction(
    '[NOVEL] Set Completed',
    props<{ completed: Title[] }>()
);

export const FetchPopulars = createAction(
    '[NOVEL] Fetch Populars',
    props<{ params: { keyword: string } }>()
);

export const SetPopulars = createAction(
    '[NOVEL] Set Populars',
    props<{ populars: Title[] }>()
);

export const FetchMillions = createAction(
    '[NOVEL] Fetch Millions',
    props<{ params: { keyword: string } }>()
);

export const FetchRecents = createAction(
    '[NOVEL] Fetch Recents',
    props<{ params: { keyword: string } }>()
);

export const SetMillions = createAction(
    '[NOVEL] Set Millions',
    props<{ millions: Title[] }>()
);

export const SetRecents = createAction(
    '[NOVEL] Set Recents',
    props<{ recentlyUpdated: Title[] }>()
);
