import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ComicService } from '@core/services/comic.service';
import { LemonAuthService } from '@core/services/lemon-auth.service';

@Component({
    selector: 'app-unsubcrise-dialog',
    templateUrl: './unsubcrise-dialog.component.html',
    styleUrls: ['./unsubcrise-dialog.component.scss']
})
export class UnsubcriseDialogComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<UnsubcriseDialogComponent>,
                private comicService: ComicService,
                public authService: LemonAuthService,
                private router: Router) { }

    ngOnInit() {
    }

    onCancel() {
        this.dialogRef.close();
    }

    onOk() {
        this.comicService.deleteAccountByReason(this.data).subscribe(() => {
            this.router.navigate(['/']).then(() => {
                localStorage.clear();
                this.authService.logout();
                window.location.reload();
            });
        });
    }

}
