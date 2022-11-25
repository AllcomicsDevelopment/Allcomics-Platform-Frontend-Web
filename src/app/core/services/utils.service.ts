import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    public getTotalPage(total: number, limit: number) {
        return Math.ceil(Math.max(total, 1) / Math.max(limit, 1)) - 1; // page 0부터 시작
    }

    public getCardType(cardNumber: number) {
        // ref: https://stackoverflow.com/questions/72768/how-do-you-detect-credit-card-type-based-on-number
        const cardRegExp = {
            amex: /^3[47][0-9]{13}$/,
            diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
            discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
            jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
            maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
            mastercard: /^5[1-5][0-9]{14}$/,
            unionpay: /^(62|88)\d+$/,
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            // electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
            // dankort: /^(5019)\d+$/,
            // interpayment: /^(636)\d+$/,
        };

        for (const key in cardRegExp) {
            if (cardRegExp[key].test(cardNumber)) {
                return key;
            }
        }
        return '';
    }
}
