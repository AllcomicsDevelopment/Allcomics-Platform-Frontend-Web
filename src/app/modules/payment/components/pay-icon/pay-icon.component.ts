import { Component, Input } from '@angular/core';

import { UtilsService } from '@core/services/utils.service';

// @ts-ignore
import amex from 'payment-icons/min/flat/amex.svg';
// @ts-ignore
import * as defaultCard from 'payment-icons/min/mono/default.svg';
// @ts-ignore
import diners from 'payment-icons/min/flat/diners.svg';
// @ts-ignore
import discover from 'payment-icons/min/flat/discover.svg';
// @ts-ignore
import jcb from 'payment-icons/min/flat/jcb.svg';
// @ts-ignore
import mastercard from 'payment-icons/min/flat/mastercard.svg';
// @ts-ignore
import unionpay from 'payment-icons/min/flat/unionpay.svg';
// @ts-ignore
import maestro from 'payment-icons/min/flat/maestro.svg';
// @ts-ignore
import visa from 'payment-icons/min/flat/visa.svg';

@Component({
    selector: 'app-pay-icon',
    templateUrl: './pay-icon.component.html',
    styleUrls: ['./pay-icon.component.scss']
})
export class PayIconComponent {
    public defaultCard = defaultCard;
    public amex = amex;
    public diners = diners;
    public discover = discover;
    public jcb = jcb;
    public maestro = maestro;
    public mastercard = mastercard;
    public unionpay = unionpay;
    public visa = visa;

    @Input() cardNum: any;

    constructor(private utils: UtilsService) {
    }

    public getPayIcon(cardNum: any) {
        if (!cardNum) {
            return '';
        }

        const cardNumber = Number(cardNum.replace(/ /gi, ''));
        const cardType = this.utils.getCardType(cardNumber);
        const paymentIcon = {
            amex: this.amex,
            diners: this.diners,
            discover: this.discover,
            jcb: this.jcb,
            maestro: this.maestro,
            mastercard: this.mastercard,
            unionpay: this.unionpay,
            visa: this.visa,
            defaultCard: this.defaultCard
        };
        return paymentIcon[cardType] || paymentIcon.defaultCard;
    }

}
