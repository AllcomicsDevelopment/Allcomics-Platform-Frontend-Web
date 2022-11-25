import { Component, Input } from '@angular/core';
import { MessageList } from '@app/modules/support/store/support.reducer';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})
export class FaqComponent {

    @Input() faqList: MessageList;

    constructor() { }
}
