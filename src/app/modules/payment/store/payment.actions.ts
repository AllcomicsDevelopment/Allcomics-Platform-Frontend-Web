import { createAction, props } from '@ngrx/store';
import { TDNHistoryList } from '@app/modules/payment/store/payment.reducer';

export interface ChargeTDNBody {
    currency: string;
    amount: number;
    tdn: number;
    ngReturn: string;
    pgName?: string;
    paymentData: PaymentData;
    // identity
    sid?: string;
    uid?: string;
    gid?: string;
    ns?: string;
}

export interface PaymentData {
    name?: string;
    method?: string;
    firstName?: string;
    lastName?: string;
    cardNumber?: string;
    cardExpMonth?: string;
    cardType?: string;
    cardExpYear?: string;
    address1?: string;
    address2?: string;
    locality?: string;
    administrativeArea?: string;
    postalCode?: number;
    country?: string;
    email?: string;
    phoneNumber?: string;
}

export const RequestSuccess = createAction(
    '[PAYMENT] Request Success'
);

export const ResetToChargeData = createAction(
    '[PAYMENT] Reset ToChargeData'
);

export const RequestFailure = createAction(
    '[PAYMENT] Request Failure',
    props<{ error: any }>()
);

export const ChargeTDN = createAction(
    '[PAYMENT] Charge TDN',
    props<{ data: ChargeTDNBody }>()
);

export const ChargeTDNDirectly = createAction(
    '[PAYMENT] Charge TDN Directly',
);

export const SetChargeTDNData = createAction(
    '[PAYMENT] Set Charge TDN Data',
    props<{ data: ChargeTDNBody }>()
);

export const SetAdditionalPaymentData = createAction(
    '[PAYMENT] Set Additional Payment Data',
    props<{ data: PaymentData }>()
);

export const FetchTDNHistory = createAction(
    '[PAYMENT] Fetch TDN History',
    props<{ params: any }>()
);

export const SetTDNHistory = createAction(
    '[PAYMENT] Set TDN History',
    props<{ tdnHistory: TDNHistoryList }>()
);

export const ResetTDNHistory = createAction(
    '[PAYMENT] Reset TDN History',
);

export const SetIsFetching = createAction(
    '[PAYMENT] Set Is Fetching',
    props<{ isFetching: boolean }>()
);
