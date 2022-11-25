import { createAction, props } from '@ngrx/store';
import { Category, Message } from '@app/models/message';

export const RequestSuccess = createAction(
    '[SUPPORT] Request Success'
);

export const RequestFailure = createAction(
    '[SUPPORT] Request Failure',
    props<{ error: any }>()
);

export const CreateNewMessage = createAction(
    '[SUPPORT] Create New Message',
    props<{ messageType: string, message: any }>()
);

export const FetchFaqList = createAction(
    '[SUPPORT] Fetch FAQ List',
    props<{ params: any }>()
);

export const SetFaqList = createAction(
    '[SUPPORT] Set Faq List',
    props<{ list: Message[], total: number, totalPage: number, page: number }>()
);

export const FetchInquiryList = createAction(
    '[SUPPORT] Fetch Inquiry List',
    props<{ params: any }>()
);

export const SetInquiryList = createAction(
    '[SUPPORT] Set Inquiry List',
    props<{ list: Message[], total: number, totalPage: number, page: number }>()
);

export const FetchNoticeList = createAction(
    '[SUPPORT] Fetch Notice List',
    props<{ params: any }>()
);

export const SetNoticeList = createAction(
    '[SUPPORT] Set Notice List',
    props<{ list: Message[], total: number, totalPage: number, page: number }>()
);

export const ResetMessageList = createAction(
    '[SUPPORT] Reset Message List',
);

export const SetIsFetching = createAction(
    '[SUPPORT] Set Is Fetching',
    props<{ isFetching: boolean }>()
);

export const SetActiveCategory = createAction(
    '[SUPPORT] Set Active Category',
    props<{ category: string }>()
);
