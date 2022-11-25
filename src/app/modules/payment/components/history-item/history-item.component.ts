import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-tdn-history-item',
    templateUrl: './history-item.component.html',
    styleUrls: ['./history-item.component.scss'],
})
export class HistoryItemComponent {

    @Input() data = {
        currency: 'KRW',
        amount: 1000,
        tdn: 10,
        chargedAt: 183478912354
    };

    constructor() {
    }
}
