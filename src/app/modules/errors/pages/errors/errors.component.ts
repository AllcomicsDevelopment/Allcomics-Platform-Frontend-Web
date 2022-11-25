import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-error-pages',
    templateUrl: './errors.component.html',
    styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent implements OnInit {

    public routeParams;
    public data;

    constructor(private activatedRoute: ActivatedRoute,
                private translateService: TranslateService,
                private location: Location) {
    }

    ngOnInit() {
        this.routeParams = this.activatedRoute.snapshot.queryParams;
        this.data = this.activatedRoute.snapshot.data;
    }

    goBack() {
        this.location.back();
    }

}
