import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { NavigationEnd, Router } from '@angular/router';

import { TemplateInfo } from '@app/models/templateInfo';
import { EventService } from '@core/services/event.service';
import { SidenavService } from '@core/services/sidenav.service';
import { LemonAuthService } from '@core/services/lemon-auth.service';
import { DeviceHelperService } from '@core/services/device-helper.service';
import { ComicService } from '@core/services/comic.service';

import 'rxjs-compat/add/operator/filter';

import { select, Store } from '@ngrx/store';
import * as fromRoot from '@app/store/root/root.reducer';
import {delay, filter, first, map, switchMap, take, takeUntil} from 'rxjs/operators';
import {interval, Observable, of, ReplaySubject} from 'rxjs';

import * as fromHome from '@app/modules/home/store/home.reducer';

import { Banner } from '@app/models/banner';
import { AlertDialogComponent } from '@shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from '@core/services/base.service';
import {int} from 'aws-sdk/clients/datapipeline';
import {environment} from '@environments/environment';

@Component({
    selector: 'app-main-template',
    templateUrl: './main-template.component.html',
    styleUrls: ['./main-template.component.scss']
})

export class MainTemplateComponent implements OnInit, OnDestroy {
    public bottomState: string;
    public templateInfo: TemplateInfo;
    private routerSubscription = null;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    // private destroyed$: any = new ReplaySubject(1);

    // public profile$;
    public profile$: Observable<any> = null;
    public profile: any;
    public myPageBanner$: Observable<Banner>;
    // @ts-ignore
    @ViewChild('sidenav', { static: true }) public sidenav: MatSidenav;

    constructor(private eventService: EventService,
                private sidenavService: SidenavService,
                private authService: LemonAuthService,
                private translate: TranslateService,
                private router: Router,
                private comicService: ComicService,
                private deviceHelperService: DeviceHelperService,
                public dialog: MatDialog,
                private rootStore$: Store<fromRoot.State>) {
        this.templateInfo = new TemplateInfo();
        this.bottomState = 'initial';
        this.getProfile();
    }

    ngOnInit() {
        this.setupEventListener();
        this.myPageBanner$ = this.rootStore$.pipe(select(fromRoot.getMyPageBanner), filter(banner => !!banner), takeUntil(this.destroyed$));
    }

    ngOnDestroy() {
        this.unsubscribeListener();
    }

    showAlertDialog() {
        this.translate.get('common.coming-soon').subscribe(message => {
            const alertDialogRef = this.dialog.open(AlertDialogComponent, {
                width: '300px',
                maxWidth: '90%',
                hasBackdrop: true,
                data: { message }
            });
        });
    }

    route(link: string) {
        this.sidenavService.toggle();
        this.router.navigateByUrl(link);
    }

    clickBanner() {
        const bannerLink = this.myPageBanner$.pipe(
            map(banner => banner.list[0].redirect_url),
            takeUntil(this.destroyed$)
        );
        bannerLink.subscribe(link => this.route(link));
    }

    doLogout() {
        // remain default language
        this.clearLocalStorageWithoutLanguage();
        this.authService.logout().then(() => window.location.reload());
    }

    getCurrentLanguage(): string {
        return this.translate.currentLang || this.translate.defaultLang || 'ko';
    }

    onClicContentCoin() {
        // console.log('KSL', 'payment clicked');
        // this.route('/payment');
    }

    private getProfile() {

        this.profile$ = this.authService.getAllcomicsProfile().pipe(
            map(res => {
                if (res) {
                    return res['body'].data.data;
                } else {
                    return null;
                }
            }),
            filter(res => res != null),
            take(1)
        );

        this.profile$.subscribe(res => {
            this.profile = res;
            console.log(this.profile);
        });
    }

    private setupEventListener() {
        this.sidenavService.setSidenav(this.sidenav);
        this.routerSubscription = this.router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe(() => {
                window.scrollTo(0, 0);
            });
    }

    private clearLocalStorageWithoutLanguage() {
        const currentLanguage = localStorage.getItem('ALLCOMICS_translateLanguage') || this.getCurrentLanguage();
        localStorage.clear();
        localStorage.setItem('ALLCOMICS_translateLanguage', currentLanguage);
    }

    private unsubscribeListener() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        // this.routerSubscription.unsubscribe();
    }

}
