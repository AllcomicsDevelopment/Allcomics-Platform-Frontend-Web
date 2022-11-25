import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TemplateInfo } from '@app/models/templateInfo';
import { MatDialog } from '@angular/material';

import { UnsubcriseDialogComponent } from '../../components/unsubcrise-dialog/unsubcrise-dialog.component';
import { UnsubcriseAlertDialogComponent } from '../../components/unsubcrise-alert-dialog/unsubcrise-alert-dialog.component';

import { ComicService } from '@core/services/comic.service';

// TODO: fix typo unsubscrise to unsubscribe
// unsubscribe... -_-
@Component({
    selector: 'app-unsubcrise',
    templateUrl: './unsubcrise.component.html',
    styleUrls: ['./unsubcrise.component.scss']
})
export class UnsubcriseComponent implements OnInit {
    public templateInfo: TemplateInfo;
    private checkOption = [];
    private checkConfirm = false;

    public selectedLanguage;
    public checkOptionMessage: string;
    public checkConfirmMessage: string;

    constructor(public dialog: MatDialog,
                public comicService: ComicService,
                private translate: TranslateService) {
        this.selectedLanguage = this.translate.currentLang || this.translate.defaultLang;
    }

    ngOnInit() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 7;
        this.templateInfo.botbar = false;
        this.templateInfo.txtTitle = 'unsubscribe';

        this.translate.get('unsubscribe.check-option').subscribe(text => {
            this.checkOptionMessage = text;
        });
        this.translate.get('unsubscribe.check-confirm').subscribe(text => {
            this.checkConfirmMessage = text;
        });
    }

    openDialog(): void {
        const isCheckedOptions = this.checkOption.length > 0;
        const isCheckedConfirm = this.checkConfirm === true;

        if (!isCheckedOptions) {
            this.dialog.open(UnsubcriseAlertDialogComponent, {
                width: '320px',
                maxWidth: '90%',
                hasBackdrop: true,
                data: { content: this.checkOptionMessage }
            });
            return;
        }

        if (!isCheckedConfirm) {
            this.dialog.open(UnsubcriseAlertDialogComponent, {
                width: '320px',
                maxWidth: '90%',
                hasBackdrop: true,
                data: { content: this.checkConfirmMessage }
            });
            return;
        }

        if (isCheckedConfirm && isCheckedOptions) {
            const dialogRef = this.dialog.open(UnsubcriseDialogComponent, {
                width: '320px',
                maxWidth: '90%',
                hasBackdrop: true,
                data: { reason: this.checkOption.join(',') }
            });
        }
    }

    onChange(object: any, optionNum: any): void {
        if (object.checked) {
            this.checkOption.push(optionNum);
        } else {
            this.checkOption = this.checkOption.filter(value => {
                return value !== optionNum;
            });
        }
    }
    onChangeConfirm(object: any): void {
        if (object.checked) {
            this.checkConfirm = true;
        } else {
            this.checkConfirm = false;
        }
    }

    deleteAccountByReason(reason: any) {
        this.comicService.deleteAccountByReason(reason).subscribe(res => {
            // returns none
        });
    }

}
