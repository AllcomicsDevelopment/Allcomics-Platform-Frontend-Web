import { Component, OnInit } from '@angular/core';
import { TemplateInfo } from '@app/models/templateInfo';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { IdolDialogComponent } from '../../components/idol-dialog/idol-dialog.component';

@Component({
    selector: 'app-idol',
    templateUrl: './idol.component.html',
    styleUrls: ['./idol.component.scss']
})
export class IdolComponent implements OnInit {
    public templateInfo: TemplateInfo;

    constructor(private bottomNav: MatBottomSheet) { }

    ngOnInit() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 8;
    }

    openBottom(): void {
        this.bottomNav.open(IdolDialogComponent);
    }

}
