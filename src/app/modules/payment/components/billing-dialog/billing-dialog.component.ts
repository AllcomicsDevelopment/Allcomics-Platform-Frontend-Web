import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

interface DialogData {
    options: any;
    messages: any;
}

@Component({
    selector: 'app-billing-dialog',
    templateUrl: './billing-dialog.component.html',
    styleUrls: ['./billing-dialog.component.scss']
})
export class BillingDialogComponent {

    constructor(public dialogRef: MatDialogRef<BillingDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onOk(): void {
        this.dialogRef.close();
    }

}
