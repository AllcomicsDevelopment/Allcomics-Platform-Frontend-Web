import { Component, Input, OnInit } from '@angular/core';
import { CustomerHistory } from '@app/models/customer-history';

@Component({
    selector: 'app-history-detail',
    templateUrl: './history-detail.component.html',
    styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit {

    public historySupports: CustomerHistory[];
    public historySupport: CustomerHistory;
    @Input() historyId: number;

    constructor() {}

    ngOnInit() {
        this.historySupports = [
            {
                id: 1,
                title: '급합니다, 결제 내역 확인은 어디에서 확인하나요?',
                date: '2019-08-19',
                content: '결제 내역 어디서 확인하나요?<br/>' +
                '메뉴랑 이곳 저곳 찾아봤는데 잘 모르겠어요ㅜ',
                status: false,
                qContent: '안녕하세요, 올코믹스 고객 지원 담당자입니다 .<br/>' +
                '<br/>' +
                '기타 궁금하신 사항에 대해서는 추가 문의주시면 성심껏<br/>' +
                '답변드리겠습니다.<br/>' +
                '<br/>' +
                '감사합니다.',
                qDate: '2019-08-20'
            },
            {
                id: 2,
                title: '안녕하세요, 올코믹스 고객 지원 담당자입니다 .',
                date: '2019-08-20',
                content: '기타 궁금하신 사항에 대해서는 추가 문의주시면 성심껏<br/>' +
                '답변드리겠습니다.<br/>' +
                '<br/>' +
                '감사합니다.',
                status: true,
            },
            {
                id: 3,
                title: '안녕하세요, 올코믹스 고객 지원 담당자입니다 .',
                date: '2019-08-20',
                content: '기타 궁금하신 사항에 대해서는 추가 문의주시면 성심껏<br/>' +
                '답변드리겠습니다.<br/>' +
                '<br/>' +
                '감사합니다.',
                status: true,
            },
            {
                id: 4,
                title: '안녕하세요, 올코믹스 고객 지원 담당자입니다 .',
                date: '2019-08-20',
                content: '기타 궁금하신 사항에 대해서는 추가 문의주시면 성심껏<br/>' +
                '답변드리겠습니다.<br/>' +
                '<br/>' +
                '감사합니다.',
                status: true,
            }
        ];

        this.historySupport =  this.historySupports.find(item => item.id === this.historyId);
    }

}
