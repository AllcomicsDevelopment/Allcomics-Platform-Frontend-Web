import {Component, Input, OnInit} from '@angular/core';
import { TemplateInfo } from '@app/models/templateInfo';
import {ActivatedRoute, Router} from '@angular/router';
import * as EpisodeActions from '@app/modules/webtoon/store/episode/episode.actions';
import {TranslateService} from '@ngx-translate/core';
import {LoginDialogComponent} from '@shared/components/login-dialog/login-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {BaseService} from '@core/services/base.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit{

    @Input() templateInfo: TemplateInfo;

    private language: string;
    private userID: string;

    constructor(
        private translate: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        public baseService: BaseService
    ) {
    }

    ngOnInit() { }

    onClickPayment()
    {

        this.baseService.getAllcomicsProfile().subscribe(res => {
            if (res && res['body'].data.data.user_id >= 0) {
                this.language = this.translate.currentLang || this.translate.defaultLang;
                this.userID = res['body'].data.data.user_id;

                if (this.language !== null && this.userID !== null && this.language !== undefined && this.userID !== undefined) {
                    const url = 'payment/' + this.language + '/' + this.userID;
                    this.router.navigateByUrl(url);
                } else {
                    this.openLoginDialog();
                }
            } else {
                this.openLoginDialog();
            }
        });
    }

    openLoginDialog() {
        const redirectPath = this.router.url;
        const loginDialogRef = this.dialog.open(LoginDialogComponent, {
            width: '400px',
            maxWidth: '90%',
            hasBackdrop: true,
            data: { redirectPath }
        });
    }
}
