import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { WINDOW } from '@core/services/window.service';

import { Observable, ReplaySubject } from 'rxjs';
import { select, Store } from '@ngrx/store';

import * as RootActions from './store/root/root.actions';
import * as fromRoot from './store/root/root.reducer';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { DeviceHelperService } from '@core/services/device-helper.service';
import { BaseService } from '@core/services/base.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'project-ag';

    private platform$: Observable<string>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private router: Router,
                private translate: TranslateService,
                private rootStore$: Store<fromRoot.State>,
                private deviceHelperService: DeviceHelperService,
                private baseService: BaseService,
                @Inject(WINDOW) private window: Window) {
    }

    ngOnInit() {
        this.getUserProfile();
        this.loadDeviceInfo();
        this.baseService.pollingCredentials$().subscribe();
        this.checkLanguage();
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    private checkLanguage() {
        const savedLanguage = localStorage.getItem('ALLCOMICS_translateLanguage');
        if (savedLanguage) {
            this.translate.setDefaultLang(savedLanguage);
            this.translate.use(savedLanguage);
            return;
        }
        this.getCountryCodeFromApp();
        this.setupCountryCodeListener();
    }

    private getCountryCodeFromApp() {
        this.deviceHelperService.sendMessageToDevice('GET_COUNTRY_CODE');
    }

    private setupCountryCodeListener() {
        this.deviceHelperService.onGetCountryCodeEvent$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            const countryCode = res.countryCode || 'us';
            const languageByCountryCode = {
                id: 'id', // 인도네시아
                ca: 'es', // 캐나다
                kr: 'ko', // 한국
                us: 'en', // 미국
                // TODO: add more languages...
            };
            // NOTE: apple 심사때는 'ko'로 박아놔야함!!!
            const language = languageByCountryCode[countryCode.toLowerCase()] || localStorage.getItem('ALLCOMICS_translateLanguage') || environment.language;
            this.translate.setDefaultLang(language);
            this.translate.use(language);
            localStorage.setItem('ALLCOMICS_translateLanguage', language);
        });
    }

    private loadDeviceInfo() {
        const platform = this.deviceHelperService.getUserAgent();
        this.rootStore$.dispatch(RootActions.SetDevicePlatform({ platform }));
        // get device info by platform
        this.platform$ = this.rootStore$.pipe(select(fromRoot.getDevicePlatform), filter(payload => payload ? true : false), takeUntil(this.destroyed$));
        this.platform$.subscribe(() => this.rootStore$.dispatch(RootActions.GetDeviceInfo()));
    }

    private getUserProfile() {
        this.rootStore$.dispatch(RootActions.GetProfile());
    }

}
