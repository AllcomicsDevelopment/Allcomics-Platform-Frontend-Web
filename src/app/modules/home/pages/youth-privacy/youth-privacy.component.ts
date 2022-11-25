import { Component, OnInit } from '@angular/core';
import { TemplateInfo } from '@app/models/templateInfo';

export interface PolicyText {
    title: string;
    description: string;
}

/* tslint:disable */
export const PRIVACY_LIST: PolicyText[] = [
    {
        title: "청소년보호정책",
        description: "㈜웹툰티비(이하 ”회사”라 함)는 청소년을 불건전한 유해 매체물로부터 보호하여 건전한 인격체로 성장할 수 있도록 “정보통신망 이용 촉진 및 정보보호 등에 관한 법률” 및 “청소년보호법” 등에 근거하여 아래와 같이 청소년 보호 책임자를 지정하고 보호 정책을 수립, 시행하고 있습니다.\n"
    },
    {
        title: "1. 유해 정보에 대한 청소년 접근 제한 및 관리조치",
        description: "- “회사”는 청소년이 회사의 서비스를 이용하는 중 아무런 제한 없이 유해한 매체물에 접근하는 일이 없도록 청소년 유해매체물에 대한 별도의 인증장치를 마련하고 있으며, 동시에 청소년 유해매체물 표시를 통해 청소년 유해 정보가 노출되지 않도록 사전 예방조치를 강구하고 있습니다."
    },
    {
        title: "2. 청소년보호를 위한 업무 담당자 교육",
        description: "- “회사”는 각 서비스 담당자들을 대상으로 청소년 보호 관련 법령 및 제재 기준, 유해 정보 발견 시 대처 방법, 위반사항 처리에 대한 보고 절차 등을 교육하고 있습니다."
    },
    {
        title: "3. 유해 정보로 인한 청소년 피해 상담 및 고충처리",
        description: "- “회사”는 청소년 유해매체물로 인한 피해상담 및 고충처리를 위하여 담당자를 지정하고 신고 접수를 받고 있으며, 그 피해가 확산되지 않도록 노력하고 있습니다. 이용자는 하단에 명시된 담당자를 통해 피해상담 및 고충처리를 요청할 수 있습니다. ”회사”는 청소년 유해매체물이 확인되는 경우 매체물 등록자에게 경고조치 또는 위법성을 검토하여 삭제 등의 조치를 취합니다."
    },
    {
        title: "4. 청소년보호 책임자 및 담당자",
        description: "개인정보보호책임자\n" +
            "- 성명 : 성경준\n" +
            "- 소속 : 플랫폼운영센터\n" +
            "- 직책 : 대표이사\n" +
            "- 전화 : 02-6243-6240\n" +
            "- E-Mail : webtoon@allcontentsvr.com\n\n" +
            "청소년보호 담당자\n" +
            "- 성명 : 김민수\n" +
            "- 소속 : 플랫폼운영센터\n" +
            "- 직책 : PD\n" +
            "- 전화 : 02-6243-6241\n" +
            "- E-Mail : webtoontv@naver.com\n\n\n" +
            "※ 이용자 피해구제 신고 및 청소년보호를 위한 관련기관안내 ※\n" +
            "\n" +
            "■ 방송통신위원회\n" +
            "https://kcc.go.kr/user.do\n" +
            "\n" +
            "■ 경찰청 사이버테러 대응센터\n" +
            "https://cyberbureau.police.go.kr\n" +
            "\n" +
            "■ 사이버경찰청\n" +
            "https://www.police.go.kr\n" +
            "\n" +
            "■한국인터넷진흥원 개인정보침해신고센터\n" +
            "https://privacy.kisa.or.kr\n" +
            "\n" +
            "■한국저작권위원회\n" +
            "https://www.copyright.or.kr\n" +
            "\n" +
            "■한국저작권보호원\n" +
            "https://www.kcopa.or.kr\n\n\n"
    },
];

@Component({
    selector: 'app-youth-privacy-page',
    templateUrl: './youth-privacy.component.html',
    styleUrls: ['./youth-privacy.component.scss']
})
export class YouthPrivacyComponent implements OnInit {

    public templateInfo: TemplateInfo;
    public privacy: PolicyText[];

    constructor() { }

    ngOnInit() {
        this.setTemplateInfo();
        this.privacy = PRIVACY_LIST;
    }

    private setTemplateInfo() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 3;
        this.templateInfo.botbar = true;
        this.templateInfo.txtTitle = 'youthpolicy';
    }


}
