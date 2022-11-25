import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-to-billing-dialog',
    templateUrl: './to-billing-dialog.component.html',
    styleUrls: ['./to-billing-dialog.component.scss']
})
export class ToBillingDialogComponent implements OnInit {

    private navigateToBilling = false;

    constructor(public dialogRef: MatDialogRef<ToBillingDialogComponent>) { }

    ngOnInit() {
    }

    onOk(): void {
        this.navigateToBilling = true;
        this.dialogRef.close({ navigateToBilling: this.navigateToBilling });
    }
}
