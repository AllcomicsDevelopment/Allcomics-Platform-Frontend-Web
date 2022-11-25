import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

interface DialogData {
    message: any;
}

@Component({
    selector: 'app-alert-dialog',
    templateUrl: './alert-dialog.component.html',
    styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent {

    constructor(public dialogRef: MatDialogRef<AlertDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onOk(): void {
        this.dialogRef.close();
    }

}
