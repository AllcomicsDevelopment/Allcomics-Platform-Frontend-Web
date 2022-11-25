import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-unsubcrise-alert-dialog',
    templateUrl: './unsubcrise-alert-dialog.component.html',
    styleUrls: ['./unsubcrise-alert-dialog.component.scss']
})
export class UnsubcriseAlertDialogComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<UnsubcriseAlertDialogComponent>) { }

    ngOnInit() {
    }

    onCancel() {
        this.dialogRef.close();
    }

    onOk() {
        this.dialogRef.close();
    }

}
