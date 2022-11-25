import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { LemonAuthService } from '@core/services/lemon-auth.service';
import { TemplateInfo } from '@app/models/templateInfo';
import {
    DeviceHelperService,
    OAuthTokenResult,
    ThirdPartyLoginSuccessResult,
    ThirdPartyLoginFailResult,
} from '@core/services/device-helper.service';

import { from, Observable, ReplaySubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import * as fromRoot from '@app/store/root/root.reducer';
import * as RootActions from '@app/store/root/root.actions';
import { LoaderService } from '@core/services/loader.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    templateInfo: TemplateInfo;
    appVersion: string;
    platform: string;
    isiOS: boolean;

    private appVersion$: Observable<string>;
    private platform$: Observable<string>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private router: Router,
                private location: Location,
                private loaderService: LoaderService,
                private rootStore$: Store<fromRoot.State>,
                private deviceHelperService: DeviceHelperService,
                private lemonAuthService: LemonAuthService) { }

    ngOnInit() {
        this.lemonAuthService.isAuthenticated()
            .then(isAuth => {
                if (isAuth) {
                    // this.location.back();
                }
            });
        this.templateInfo = new TemplateInfo();
        this.templateInfo.topbar = 3;
        this.templateInfo.botbar = false;
        this.templateInfo.txtTitle = 'login';

        this.getAppVersion();
        this.setupCustomEventListener();
        this.setupRootReducerListener();
        this.isiOS = this.deviceHelperService.getUserAgent() === 'ios';
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    onSignWithSocial(type: string) {
        switch (type) {
            case 'kakao':
                this.lemonAuthService.loginWithProvider('kakao');
                break;
            case 'google':
                this.lemonAuthService.loginWithProvider('google');
                break;
            case 'apple':
                this.requestAppleLogin();
                break;
            case 'facebook':
            case 'twitter':
            default:
                break;
        }
    }

    private requestAppleLogin() {
        this.loaderService.show();
        this.deviceHelperService.sendMessageToDevice(`APPLE_LOGIN`);
        setTimeout(() => {
            this.loaderService.hide();
            alert(`Login Error\nYou took too long to login`);
        }, 90000);
        return;
    }

    private getAppVersion() {
        this.deviceHelperService.sendMessageToDevice('GET_APP_VERSION');
        // Flow
        // 0. [Angular - LoginComponent] DeviceHelperService의 onGetAppVersionEvent$ 구독
        // 1. [Angular - LoginComponent] DeviceHelperService.sendMessageToDevice('GET_APP_VERSION') 호출. Native로 'GET_APP_VERSION' 메세지 전달
        // 2. [Native] WebView 자바스크립트 실행. evalute getAppVersionFromNative('1.0.1') => 해당 함수는 index.html에 정의되어 있음
        // 3. [Angular - index.html] index.html의 getAppVersionFromNative()이 호출되고 CustomEvent 실행
        // 4. [Angular - DeviceHelperService] CustomEvent를 구독하고 있고, 'app-version' 이벤트가 실행되면 onGetPlatformAndVersion 서브젝트 발행
        // 5. [Angular - LoginComponent] onGetAppVersionEvent$에 Observable 형식의 데이터 받아옴
    }

    private setupCustomEventListener() {
        const platformAndVersion$ = this.deviceHelperService.onGetAppVersionEvent$.pipe(filter(data => !!data), takeUntil(this.destroyed$));
        platformAndVersion$.subscribe(({ appVersion }) => this.rootStore$.dispatch(RootActions.SetAppVersion({ appVersion })));

        const successSDKLogin$ = this.deviceHelperService.onSuccessSDKLoginEvent$.pipe(filter(token => !!token), takeUntil(this.destroyed$));
        successSDKLogin$.subscribe((result: ThirdPartyLoginSuccessResult) => {
            const { oAuthToken } = result;
            this.checkOAuthToken(oAuthToken);
        });

        const failSDKLogin$ = this.deviceHelperService.onFailSDKLoginEvent$.pipe(filter(res => !!res), takeUntil(this.destroyed$));
        failSDKLogin$.subscribe((result: ThirdPartyLoginFailResult) => {
            const { platform, provider, reason } = result;
            this.loaderService.hide();
            alert(`Login Error\nplatform: ${platform}\nprovider: ${provider}\nreason: ${reason}`);
        });
    }

    private setupRootReducerListener() {
        this.platform$ = this.rootStore$.pipe(select(fromRoot.getDevicePlatform), filter(platform => !!platform), takeUntil(this.destroyed$));
        this.platform$.subscribe(platform => this.platform = platform);

        this.appVersion$ = this.rootStore$.pipe(select(fromRoot.getAppVersion), filter(appVersion => !!appVersion), takeUntil(this.destroyed$));
        this.appVersion$.subscribe(appVersion => this.appVersion = appVersion);
    }

    private checkOAuthToken(oAuthToken: string) {
        try {
            const oAuthTokenResult: OAuthTokenResult = JSON.parse(oAuthToken);
            this.lemonAuthService.doSDKLoginWithToken(oAuthTokenResult)
                .then(() => this.lemonAuthService.getCredentials())
                .then(() => {
                    this.loaderService.hide();
                    window.location.reload();
                })
                .catch(err => {
                    this.loaderService.hide();
                    alert(err);
                });
        } catch (e) {
            this.loaderService.hide();
            alert(e);
        }
    }
}
