import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

interface DialogData {
    options: any;
    messages: any;
}

@Component({
    selector: 'app-notification-dialog',
    templateUrl: './notification-dialog.component.html',
    styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<NotificationDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    ngOnInit() {
    }

    onOk(): void {
        // EVENT CONFIRM
        this.dialogRef.close();
    }
}
