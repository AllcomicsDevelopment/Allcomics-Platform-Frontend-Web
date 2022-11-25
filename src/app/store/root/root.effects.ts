import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import * as semver from 'semver';

import { of, zip } from 'rxjs';
import { map, tap, switchMap, filter, delay, catchError, exhaustMap} from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as fromRoot from './root.reducer';
import * as RootActions from './root.actions';

import { WINDOW } from '@core/services/window.service';
import { DeviceHelperService } from '@core/services/device-helper.service';
import { LemonAuthService } from '@core/services/lemon-auth.service';
import { LoaderService } from '@core/services/loader.service';

import { environment } from '@environments/environment';
import { ComicService } from '@core/services/comic.service';

const PROJECT = environment.project.toUpperCase();

@Injectable()
export class RootEffects {

    constructor(private actions$: Actions,
                private rootStore$: Store<fromRoot.State>,
                private translate: TranslateService,
                private lemonAuthService: LemonAuthService,
                private deviceService: DeviceHelperService,
                private comicService: ComicService,
                private loaderService: LoaderService,
                private router: Router,
                @Inject(WINDOW) private window: Window) {}

    requestFailure$ = createEffect(
        () => this.actions$.pipe(
            ofType(RootActions.RequestFailure),
            map(action => action.error),
            tap(() => this.loaderService.hide()),
            tap(error => {
                const errorMessage = error['message'] || error['statusText'] || error;
                alert(`Error! ${errorMessage}`);
            })
        ),
        { dispatch: false }
    );

    fetchMyPageBanner$ = createEffect(
        () => this.actions$.pipe(
            ofType(RootActions.FetchMyPageBanner),
            exhaustMap(action => {
                const { myPageBannerId } = action;
                return this.comicService.getDetailBanner(myPageBannerId).pipe(
                    map(myPageBanner => RootActions.SetMyPageBanner({ myPageBanner })),
                    catchError(error => of(RootActions.RequestFailure({ error })))
                );
            })
        )
    );

    getAndroidDeviceInfo$ = createEffect(
        () => this.actions$.pipe(
            ofType(RootActions.GetDeviceInfo),
            switchMap(() => this.rootStore$.pipe(select(fromRoot.getDevicePlatform), filter(platform => platform === 'android'))),
            filter(() => typeof this.window[`${environment.project}`] !== 'undefined'),
            switchMap(() => {
                // getDeviceToken, getVersionName 함수는 안드로이드에서 전달
                const deviceToken = this.window[`${environment.project}`].getDeviceToken();
                const appVersion = this.window[`${environment.project}`].getVersionName();
                return of({ deviceToken, appVersion });
            }),
            map(({ deviceToken, appVersion }) => {
                const deviceInfo = {
                    isOnMobileApp: true,
                    platform: 'android',
                    deviceToken,
                    appVersion
                };
                this.setWindowConfiguration(deviceInfo);
                const shouldSetLanguage = semver.lt(appVersion, '1.0.5');
                if (shouldSetLanguage) {
                    this.setDefaultLanguage();
                }
                return RootActions.SetDeviceInfo({ deviceInfo });
            }),
        ),
    );

    getiOSDeviceInfo$ = createEffect(
        () => this.actions$.pipe(
            ofType(RootActions.GetDeviceInfo),
            switchMap(() => this.rootStore$.pipe(select(fromRoot.getDevicePlatform), filter(iOSPlatform => iOSPlatform === 'ios'))),
            tap(() => this.deviceService.sendMessageToDevice('GET_APP_INFO', {}, 'ios')),
            delay(100),
            switchMap(() => of(this.window[`${PROJECT}_CONF`])),
            tap(conf => {
                const hasNotAppVersion = !conf.appVersion;
                if (hasNotAppVersion) {
                    this.rootStore$.dispatch(RootActions.GetDeviceInfo());
                }
            }),
            filter(conf => !!conf.appVersion),
            map(conf => {
                const deviceInfo = {
                    isOnMobileApp: true,
                    deviceToken: conf.deviceToken || '',
                    appVersion: conf.appVersion,
                    platform: 'ios',
                };
                this.setWindowConfiguration(deviceInfo);
                return RootActions.SetDeviceInfo({ deviceInfo });
            }),
        )
    );

    setOtherPlatform$ = createEffect(
        () => this.actions$.pipe(
            ofType(RootActions.GetDeviceInfo),
            switchMap(() => this.rootStore$.pipe(
                select(fromRoot.getDevicePlatform),
                filter(platform => (platform !== 'ios' && platform !== 'android') ? true : false))
            ),
            map(platform => {
                const deviceInfo = {
                    isOnMobileApp: false,
                    deviceToken: '',
                    appVersion: '',
                    platform,
                };
                this.setWindowConfiguration(deviceInfo);
                this.setDefaultLanguage();
                return RootActions.SetDeviceInfo({ deviceInfo });
            })
        )
    );

/*    getProfile$ = createEffect(
        () => this.actions$.pipe(
            ofType(RootActions.GetProfile),
            switchMap(() => this.lemonAuthService.isAuthenticated$()),
            tap(() => this.loaderService.hide()),
            exhaustMap(isAuth => {
                if (!isAuth) {
                    return of(RootActions.RequestSuccess()); // DO NOTHING
                }
                return this.lemonAuthService.getCredentials$().pipe(
                    switchMap(() => zip(this.lemonAuthService.getUserProfile$(), this.comicService.getTDNBalance())),
                    map(([profile, tdn]) => ({ ...profile, tdn })),
                    map(profileWithTDN => RootActions.SetProfile({ profile: profileWithTDN })),
                    catchError(error => of(RootActions.RequestFailure({ error })))
                );
            }),
        )
    );*/

    logout$ = createEffect(
        () => this.actions$.pipe(
            ofType(RootActions.Logout),
            switchMap(() => this.lemonAuthService.logout$()),
            map(() => RootActions.ResetProfile())
        ),
    );

    private setWindowConfiguration(data: any) {
        this.window[`${PROJECT}_CONF`] = data;
    }

    private setDefaultLanguage() {
        const language = localStorage.getItem('ALLCOMICS_translateLanguage') || environment.language;
        this.translate.setDefaultLang(language);
        this.translate.use(language);
    }

}

