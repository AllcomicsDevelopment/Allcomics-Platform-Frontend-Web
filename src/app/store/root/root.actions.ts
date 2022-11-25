import { createAction, props } from '@ngrx/store';
import { Banner } from '@app/models/banner';

export const FetchMyPageBanner = createAction(
    '[ROOT] Fetch My Page Banner',
    props<{ myPageBannerId: string }>()
);

export const SetMyPageBanner = createAction(
    '[ROOT] Set My Page Banner',
    props<{ myPageBanner: Banner }>()
);

export const GetDeviceInfo = createAction(
    '[ROOT] Get Device Info'
);

export const SetDeviceInfo = createAction(
    '[ROOT] Set Device Info',
    props<{ deviceInfo: any }>()
);

export const SetDevicePlatform = createAction(
    '[ROOT] Set Device Platform',
    props<{ platform: string }>()
);

export const RequestSuccess = createAction(
    '[ROOT] Request Success'
);

export const RequestFailure = createAction(
    '[ROOT] Request Failure',
    props<{ error: any }>()
);

export const GetProfile = createAction(
    '[ROOT] Get Profile'
);

export const SetProfile = createAction(
    '[ROOT] Set Profile',
    props<{ profile: any }>()
);

export const Logout = createAction(
    '[ROOT] Logout'
);

export const ResetProfile = createAction(
    '[ROOT] Reset Profile'
);

export const SetAppVersion = createAction(
    '[ROOT] Set App Version',
    props<{ appVersion: string }>()
);
