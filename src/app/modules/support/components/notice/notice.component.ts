import { Component, Input } from '@angular/core';
import { MessageList } from '@app/modules/support/store/support.reducer';

@Component({
    selector: 'app-notice',
    templateUrl: './notice.component.html',
    styleUrls: ['./notice.component.scss']
})
export class NoticeComponent {

    @Input() noticeList: MessageList;

}
