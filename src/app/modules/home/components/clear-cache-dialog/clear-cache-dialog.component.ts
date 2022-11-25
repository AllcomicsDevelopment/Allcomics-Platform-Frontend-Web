import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export enum DialogCloseReason {
    CLOSE = 'CLOSE',
    OK = 'OK',
}

@Component({
    selector: 'app-clear-cache-dialog',
    templateUrl: './clear-cache-dialog.component.html',
    styleUrls: ['./clear-cache-dialog.component.scss']
})
export class ClearCacheDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<ClearCacheDialogComponent>) { }

    ngOnInit() {
    }

    onCancel() {
        this.dialogRef.close(DialogCloseReason.CLOSE);
    }

    onOk() {
        this.dialogRef.close(DialogCloseReason.OK);
    }

}
