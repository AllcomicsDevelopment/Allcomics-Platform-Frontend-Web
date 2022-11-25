import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/';
import { Episode } from '@app/models/episode';
import { ComicService } from '@core/services/comic.service';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
    selector: 'app-detail-dialog',
    templateUrl: './detail-dialog.component.html',
    styleUrls: ['./detail-dialog.component.scss']
})
export class DetailDialogComponent implements OnInit, OnDestroy {

    public activeIndex: number;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(public dialogRef: MatBottomSheetRef<DetailDialogComponent>,
                private comicService: ComicService,
                @Inject(MAT_BOTTOM_SHEET_DATA) public data: Episode) {
        this.activeIndex = 1;
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    onOk(): void {
        const billingType = this.activeIndex === 1 ? 'rent' : 'buy';
        this.dialogRef.dismiss({ billingType, episode: this.data });
    }

    changeStatus(index: number) {
        this.activeIndex = index;
    }

    getContentCoinPrice(currency: string, originPrice: number): { target: string; price: number; } {
        const exchange = this.comicService.getExchange(currency);
        const { target, ratio, decimal } = exchange;
        const price = this.getTargetPrice(originPrice, ratio || 1, decimal || 0);
        return { target, price };
    }

    private getTargetPrice(sourcePrice: number, ratio: number = 1, decimal: number = 0) {
        const A = sourcePrice * ratio;
        const D = Math.pow(10, decimal);
        const total = Math.round(A * D) / D;
        return total;
    }

}
