import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MessageList } from '@app/modules/support/store/support.reducer';

import { ComicService } from '@core/services/comic.service';
import { LemonAuthService } from '@core/services/lemon-auth.service';
import {filter, map, switchMap} from 'rxjs/operators';
import {Category, Message, Status, SubCategory, Type} from '@app/models/message';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HistoryComponent implements OnInit {

    @Input() inquiryList: MessageList;
    public detailInquiryList = [];

    constructor(private route: Router,
                private comicService: ComicService,
                private lemonAuthService: LemonAuthService) { }

    ngOnInit() {
    }

    onShowDetail(id: any) {
        localStorage.setItem('tab_selected', 'history');
        this.route.navigateByUrl('/support/history-detail/' + id);
    }

    onAfterExpand(item: Message) {
        const { id } = item;
        const shouldNotGetMessage = this.detailInquiryList.some(inquiry => inquiry.id === id);
        if (shouldNotGetMessage) {
            return;
        }

        // const detailMessage$ = this.lemonAuthService.isAuthenticated$().pipe(
        //     filter(isAuth => !!isAuth),
        // );
        const detailMessage$ = this.lemonAuthService.isAllcomicsAuth().pipe(
            map(res => {
                if (res['body'].data.data.isValid) {
                    return this.comicService.getMessageById(id).pipe(
                       map(replay => {
                           const data = replay['body'].data.data;
                           return {
                               id: data['AskID'],
                               createdAt: data['CreatedAt'],
                               category: 'common', // 공지사항, FAQ, 자주 묻는 질문 등
                               type: data['AskID'], // 유저 or 벤더 등등
                               title: data['Title'], // 제목
                               content: data['Content'], // 내용. HTML 포맷의 string
                               author: data['UserID'],
                               status: data['Status'] === 1 ? 'replied' : 'waiting', // 답변대기, 답변완료 등등
                               reply: data['reply'].length > 0 ? {
                                   author: data['reply'][0].AskReplyID,
                                   content: data['reply'][0]['Content'],
                                   createdAt: data['reply'][0]['CreatedAt'],
                                   updatedAt: data['reply'][0]['UpdatedAt'],
                               } : null
                           };
                       })
                    );
                }
            })
        );
        detailMessage$.subscribe(res => {
            res.subscribe(reply => {
                this.detailInquiryList.push(reply);
            });
        });
    }

    getDetailMessage(item: Message) {
        const { id } = item;
        const data = this.detailInquiryList.filter(detail => detail.id === id)[0] || null;
        return data;
    }
}
