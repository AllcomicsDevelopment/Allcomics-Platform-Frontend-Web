import { Action, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { ChargeTDNBody } from './payment.actions';
import * as PaymentActions from './payment.actions';
import * as MyPageActions from '@app/modules/my-page/store/my-page.actions';

export interface GetTdnHistoryResult {
    currency: string;
    amount: any;
    tdn: number;
    chargedAt: any;
}

export interface TDNHistoryList {
    list: GetTdnHistoryResult[];
    total: number;
    page: number;
    limit: number;
    totalPage: number;
}

export interface State {
    isFetching: boolean;
    toChargeData: ChargeTDNBody;
    tdnHistory: TDNHistoryList;
}

export const initialState: State = {
    isFetching: false,
    toChargeData: null,
    tdnHistory: { list: [], total: 0, page: 0, limit: 10, totalPage: 0 },
};

export const _paymentReducer = createReducer(
    initialState,
    on(PaymentActions.RequestSuccess, (state) => ({
        ...state,
    })),
    on(PaymentActions.SetChargeTDNData, (state, { data }) => ({
        ...state,
        toChargeData: data
    })),
    on(PaymentActions.SetAdditionalPaymentData, (state, { data }) => {
        const toChargeData = state.toChargeData;
        toChargeData.paymentData = { ...toChargeData.paymentData, ...data };
        return { ...state, toChargeData };
    }),
    on(PaymentActions.ResetToChargeData, (state) => ({
        ...state,
        toChargeData: null
    })),
    on(PaymentActions.SetTDNHistory, (state, { tdnHistory }) => ({
        ...state,
        tdnHistory
    })),
    on(PaymentActions.ResetTDNHistory, state => ({
        ...state,
        tdnHistory: { list: [], total: 0, page: 0, limit: 10, totalPage: 0 }
    })),
    on(PaymentActions.SetIsFetching, (state, { isFetching }) => ({
        ...state,
        isFetching
    })),
);

export function paymentReducer(state: State | undefined, action: Action) {
    return _paymentReducer(state, action);
}

const selectPayment = createFeatureSelector<State>('payment');
export const getIsFetching = createSelector(selectPayment, (state: State) => state.isFetching);
export const getToChargeData = createSelector(selectPayment, (state: State) => state.toChargeData);
export const getTdnHistory = createSelector(selectPayment, (state: State) => state.tdnHistory);
