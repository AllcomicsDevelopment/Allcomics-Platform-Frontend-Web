import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

import { Observable, Subject } from 'rxjs';

const PROJECT = environment.project.toUpperCase();

// please refer getAccessTokenFromNative on index.html
export interface OAuthTokenResult {
    provider: string;
    platform: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiredAt?: Date;
    accessTokenExpiresIn?: number;
    // for apple login
    identityToken?: string;
    nonce?: string;
    user?: string;
}

export interface ThirdPartyLoginSuccessResult {
    oAuthToken: string; // JSON string 형태임. OAuthTokenResult 타입으로 parse 가능
}

export interface ThirdPartyLoginFailResult {
    platform: string;
    provider: string;
    reason: string;
}

// please refer getDeviceInfoFromNative on index.html
export interface DeviceInfo {
    platform: string;
    deviceToken: string;
    appVersion: string;
}

@Injectable({
    providedIn: 'root'
})
export class DeviceHelperService {

    private accessTokenSubject: Subject<ThirdPartyLoginSuccessResult> = new Subject();
    private failLoginSubject: Subject<ThirdPartyLoginFailResult> = new Subject();
    private deviceInfoSubject: Subject<DeviceInfo> = new Subject();
    private appVersionSubject: Subject<{ appVersion: string }> = new Subject();
    private logoutSubject: Subject<{ result: boolean }> = new Subject();
    private countryCodeSubject: Subject<{ countryCode: string }> = new Subject();

    constructor() {
        window.addEventListener('success-sdk-login', this.onSuccessSDKLogin.bind(this), true);
        window.addEventListener('fail-sdk-login', this.onFailSDKLogin.bind(this), true);
        window.addEventListener('device-info', this.onGetDeviceInfo.bind(this), true);
        window.addEventListener('app-version', this.onGetPlatformAndVersion.bind(this), true);
        window.addEventListener('logout', this.onGetResponseLogoutSubject.bind(this), true);
        window.addEventListener('country-code', this.onGetCountryCodeSubject.bind(this), true);
    }

    private onSuccessSDKLogin = event => this.accessTokenSubject.next(event.detail);
    private onFailSDKLogin = event => this.failLoginSubject.next(event.detail);
    private onGetDeviceInfo = event => this.deviceInfoSubject.next(event.detail);
    private onGetPlatformAndVersion = event => this.appVersionSubject.next(event.detail);
    private onGetResponseLogoutSubject = event => this.logoutSubject.next(event.detail);
    private onGetCountryCodeSubject = event => this.countryCodeSubject.next(event.detail);

    get onSuccessSDKLoginEvent$(): Observable<ThirdPartyLoginSuccessResult> {
        return this.accessTokenSubject.asObservable();
    }

    get onFailSDKLoginEvent$(): Observable<ThirdPartyLoginFailResult> {
        return this.failLoginSubject.asObservable();
    }

    get onGetDeviceInfoEvent$(): Observable<DeviceInfo> {
        return this.deviceInfoSubject.asObservable();
    }

    get onGetAppVersionEvent$(): Observable<{ appVersion: string }> {
        return this.appVersionSubject.asObservable();
    }

    get onGetResponseLogoutEvent$(): Observable<{ result: boolean }> {
        return this.logoutSubject.asObservable();
    }

    get onGetCountryCodeEvent$(): Observable<{ countryCode: string }> {
        return this.countryCodeSubject.asObservable();
    }

    sendMessageToDevice(action: string, actionParams: any = {}, platform = null) {
        let deviceType = platform;
        if (!deviceType) {
            deviceType = this.getUserAgent();
            const isNotValidDeviceType = deviceType !== 'ios' && deviceType !== 'android';
            if (isNotValidDeviceType) {
                return;
            }
        }

        if (deviceType === 'ios') {
            // WKWebView 방식
            window['webkit'].messageHandlers[`${PROJECT}_PROTOCOL`].postMessage({ action, actionParams });
            return;
        }

        if (deviceType === 'android') {
            const paramsStr = JSON.stringify(actionParams);
            const projectName = PROJECT.toLowerCase();
            window[`${projectName}`].postMessageToAndroid(action, paramsStr);
            return;
        }
    }

    getAppVersionForiOS() {
        this.makeRequestForiOS(`${PROJECT}_GetAppVersion`);
    }

    getDeviceTokenForiOS() {
        this.makeRequestForiOS(`${PROJECT}_GetDeviceToken`);
    }

    getAppVersionAndDeviceTokenForiOS() {
        this.makeRequestForiOS(`${PROJECT}_GetAppVersionAndGetDeviceToken`); // iOS 앱을 통해 index.html에 정의되어 있는 setiOSDeviceToken 함수 호출
    }

    private makeRequestForiOS(actionType: string) {
        // JavaScript to send an action to your Objective-C code
        const appName = PROJECT.toLowerCase();
        const actionParameters = {};
        const escapedJsonParameters = escape(JSON.stringify(actionParameters));
        const requestURL = `${appName}://${actionType}#${escapedJsonParameters}`;

        document.location.href = requestURL;
        return false;
    }

    getUserAgent() {
        const userAgent = window.navigator.userAgent.toUpperCase();
        const isAndroidApp = userAgent.indexOf(`${PROJECT}_ANDROID`) > -1;
        const isiOSApp = userAgent.indexOf(`${PROJECT}_IOS`) > -1;

        if (isAndroidApp) {
            return 'android';
        }
        if (isiOSApp) {
            return 'ios';
        }
        return 'other';
    }
}
