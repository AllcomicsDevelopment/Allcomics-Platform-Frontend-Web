import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { TemplateInfo } from '@app/models/templateInfo';
import { Account } from '@app/models/account';
import { ComicService } from '@core/services/comic.service';
import { LemonAuthService } from '@core/services/lemon-auth.service';

import { ClearCacheDialogComponent, DialogCloseReason } from '../../components/clear-cache-dialog/clear-cache-dialog.component';
import { LoginDialogComponent } from '@shared/components/login-dialog/login-dialog.component';

import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';
import * as fromRoot from '../../../../store/root/root.reducer';
import { BaseService } from '@core/services/base.service';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit, OnDestroy {
    public templateInfo: TemplateInfo;
    public isChecked: boolean;
    public selectedLanguage;
    public isAuthenticated = false;

    public profile: any;
    public pleaseLoginText: string;

    public randomCachedSize = 0;
    public appVersion = '1.0.0';
    public profile$: Observable<any>;
    public isAuthenticated$: Observable<any>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private comicService: ComicService,
                private lemonService: LemonAuthService,
                private translate: TranslateService,
                private rootStore$: Store<fromRoot.State>,
                private router: Router,
                public dialog: MatDialog) {
        this.selectedLanguage = this.translate.currentLang || this.translate.defaultLang;
    }

    ngOnInit() {
        this.setTemplateInfo();
        this.setupObservable();
        this.setNotification();
        this.setAppVersion();

        this.translate.get('setting.please-login').subscribe(text => this.pleaseLoginText = text);

        // TODO: delete below
        const MIN = 10;
        const MAX = 50;
        this.randomCachedSize = Math.random() * (MAX - MIN) + MIN; // 10 ~ 50;
    }

    private setAppVersion() {
        const appVersion$ = this.rootStore$.pipe(
            select(fromRoot.getDeviceInfo),
            filter(info => info ? true : false),
            map(deviceInfo => deviceInfo.appVersion),
            takeUntil(this.destroyed$)
        );
        appVersion$.subscribe((version: string) => this.appVersion = 'v3.0.1');
    }

    private setupObservable() {
        this.profile$ = this.rootStore$.pipe(select(fromRoot.getProfile), filter(profile => {
            return profile ? true : false;
        }), takeUntil(this.destroyed$));
        this.isAuthenticated$ = this.lemonService.isAuthenticated$().pipe(takeUntil(this.destroyed$));

        this.isAuthenticated$.subscribe(isAuth => this.isAuthenticated = isAuth);
        this.profile$.subscribe(profile => this.profile = profile);
    }

    private setNotification() {
        const isAuth$ = this.isAuthenticated$.pipe(filter(isAuth => isAuth ? true : false), takeUntil(this.destroyed$));
        isAuth$.subscribe(() => this.onGetNotification());
    }

    private setTemplateInfo() {
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 7;
        this.templateInfo.txtTitle = 'setting';
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    openLoginDialog(): void {
        const redirectPath = this.router.url;
        const loginDialogRef = this.dialog.open(LoginDialogComponent, {
            width: '400px',
            maxWidth: '90%',
            hasBackdrop: true,
            data: { redirectPath }
        });
    }

    onGetNotification() {
        this.comicService.getAccount().subscribe((account: Account) => {
            this.isChecked = account.enableEventsNotification;
        });
    }

    onChangeToggle() {
        this.comicService.setAccount({ enableEventsNotification: !this.isChecked }).subscribe((account: Account) => {
            this.isChecked = account.enableEventsNotification;
        });
    }

    onChangeLanguage() {
        // TODO: Save selected language to the persistent storage
        this.translate.use(this.selectedLanguage).subscribe(data => {
            this.pleaseLoginText = data.setting['please-login'];
            localStorage.setItem('ALLCOMICS_translateLanguage', this.selectedLanguage);
            // window.location.reload();
        });
    }

    clearCache() {
        const dialogRef = this.dialog.open(ClearCacheDialogComponent, {
            width: '300px',
            hasBackdrop: true,
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === DialogCloseReason.OK) {
                this.randomCachedSize = 0;
            }
        });
    }
}
