import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from '@core/services/loader.service';

const COLOR = {
    main: '#46c1be'
};

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {

    @Input() borderColor = COLOR.main;
    isLoading$: Subject<boolean> = this.loaderService.isLoading$;

    constructor(private loaderService: LoaderService) {
    }
}
