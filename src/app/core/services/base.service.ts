import { Injectable, OnDestroy } from '@angular/core';
import {from, Observable, Subject, throwError, timer, of, zip} from 'rxjs';
import {catchError, filter, finalize, map, retry, share, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import { environment } from '@environments/environment';

import { LemonOAuthTokenResult, LemonOptions } from '@lemoncloud/lemon-front-lib';
import { AuthService as LemonCoreService, LoggerService } from '@lemoncloud/lemon-front-lib';
import { TranslateService } from '@ngx-translate/core';

import {HttpClientModule, HttpHandler, HttpParams, HttpRequest} from '@angular/common/http';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';


const POLLING_TIME = 1000 * 60 * 5; // 5 minutes;

@Injectable({
    providedIn: 'root'
})
export class BaseService implements OnDestroy {

    protected apiUrl = environment.apiUrl;
    protected OAUTH_ENDPOINT: string = environment.oauthAPI;
    protected redirectUrl: string;
    private lemonCoreService: LemonCoreService;
    // for polling to get credentials(refresh)
    private lemonLogger: LoggerService;
    private refreshCredentials$: Observable<AWS.Credentials | null>;
    private stopPolling$ = new Subject();

    constructor(protected translate: TranslateService, private httpClient: HttpClient) {
        const project = environment.project;
        const oAuthEndpoint = environment.oauthAPI;
        this.redirectUrl = `${window.location.protocol}//${window.location.host}/auth/oauth-response`;
        this.lemonCoreService = new LemonCoreService({ project, oAuthEndpoint });

        this.lemonLogger = new LoggerService('ALLCOMICS');
        // setup polling
        this.refreshCredentials$ = timer(1, POLLING_TIME).pipe(
            switchMap(() => this.getCredential$()),
            retry(),
            share(),
            takeUntil(this.stopPolling$)
        );
    }

    ngOnDestroy() {
        this.stopPolling$.next();
        this.stopPolling$.complete();
    }

    pollingCredentials$(): Observable<AWS.Credentials | null> {
        return this.refreshCredentials$.pipe(
            tap(() => this.lemonLogger.warn(`polling credentials every ${Math.floor(POLLING_TIME / 60 / 1000)} minutes...`))
        );
    }

    getCredential$() {
        return from(this.lemonCoreService.getCredentials());
    }

    private setLemonCoreOptions(options: LemonOptions) {
        this.lemonCoreService.setLemonOptions(options);
    }

    private getExtraHeader() {
        const defaultLanguage = this.getLanguage();
        return { 'x-lemon-language': defaultLanguage };
    }

    private getLanguage() {
        return localStorage.getItem('ALLCOMICS_translateLanguage') || this.translate.currentLang || this.translate.defaultLang || environment.language;
    }

    private checkShouldUpdateHeader(path: string) {
        const options = { project: environment.project, oAuthEndpoint: environment.oauthAPI };
        // this.setLemonCoreOptions(options);
        // const extraHeader = this.getExtraHeader();
        // this.setLemonCoreOptions({ ...options, extraHeader });
        if (!path.includes('oauth') && !path.includes('profile')) {
            const extraHeader = this.getExtraHeader();
            this.setLemonCoreOptions({ ...options, extraHeader });
        } else {
            this.setLemonCoreOptions(options);
        }
    }

    public request(method: string = 'GET', endpoint: string, path: string, params?: any, body?: any) {
        this.checkShouldUpdateHeader(path);
        const data = this.lemonCoreService.request(method, endpoint, path, params, body);
        // console.log('Request?\n', method, '\n', endpoint, '\n', path, '\n', params, '\n', body, '\n', this.lemonCoreService, '\n', this.lemonCoreService.request, '\n', data);
        return data;
    }

    public request1(method: string = 'GET', endpoint: string, path: string, params?: any, body?: any) {
        const url = endpoint + path;

        return this.httpClient.request(
            new HttpRequest('POST', url, { ...params })
        ).toPromise();
    }

    public request$(method: string = 'GET', endpoint: string, path: string, params?: any, body?: any) {
        return from(this.request(method, endpoint, path, params, body));
    }

    public request1$(method: string = 'GET', endpoint: string, path: string, params?: any, body?: any) {
        return from(this.request1(method, endpoint, path, params, body));
    }

    public requestWithCredentials(method: string = 'GET', endpoint: string, path: string, params?: any, body?: any) {
        // request after get AWS credential
        return this.lemonCoreService.requestWithCredentials(method, endpoint, path, params, body);
    }

    public requestWithCredentials$(method: string = 'GET', endpoint: string, path: string, params?: any, body?: any) {
        // request after get AWS credential
        return from(this.requestWithCredentials(method, endpoint, path, params, body));
    }

    protected handleError(error: any) {
        return throwError(error);
    }

    public isAuthenticated() {
        const data = this.lemonCoreService.isAuthenticated();
        from(data).subscribe(d => {
            console.log('KSL', 'lemon auth', d);
        });
        return data;
    }

    public isAllcomicsAuth() {
        const param = {
            session_token: localStorage.getItem('session_token') + '',
        };
        return from(this.request1('POST', environment.localUrl, '/client/auth/validate', param));
        // return this.getIP().pipe(
        //     // map(res => {
        //     switchMap(res => {
        //         const param = {
        //             session_token: localStorage.getItem('session_token') + '',
        //             ip_addr: res.ip
        //         };
        //         return this.request1('POST', environment.localUrl, '/client/auth/validate', param);
        //     }),
        //     map(res => {
        //         return res['body'].data.data.isValid;
        //     }),
        // );
    }

    public getAllcomicsProfile() {
        return from(this.request1('POST', environment.localUrl, '/client/auth/profile', {session_token: localStorage.getItem('session_token') + ''}));
    }

    public isAuthenticated$() {
        return from(this.isAuthenticated());
    }

    public getCredentials() {
        const data = this.lemonCoreService.getCredentials();
        return data;
    }

    public getCredentials$() {
        return from(this.getCredentials());
    }

    public logout() {
        return this.lemonCoreService.logout();
    }

    public logout$() {
        return from(this.logout());
    }

    public createCredentialsByProvider(provider: string = 'kakao', code: string) {
        return this.request('POST', this.OAUTH_ENDPOINT, `/oauth/${provider}/token`, {}, { code })
            .then((token: LemonOAuthTokenResult) => {
                // console.log(token);
                return this.buildCredentialsByToken(token);
            });
    }

    public loginWithProvider(provider: string = 'kakao', redirectPath: string = '') {
        const redirectUrl = redirectPath ? `${this.redirectUrl}?redirectPath=${redirectPath}` : `${this.redirectUrl}`;
        console.log('KSL', 'redirect', redirectUrl);
        window.location.replace(`${this.OAUTH_ENDPOINT}/oauth/${provider}/authorize?redirect=${redirectUrl}`);
    }

    public buildCredentialsByToken(data: LemonOAuthTokenResult) {
        const _data = this.lemonCoreService.buildCredentialsByToken(data);
        // console.log('token', _data);
        return _data;
    }

    public requestLemon(method: string = 'GET', endpoint: string, path: string, params?: any, body?: any) {
        this.checkShouldUpdateHeader(path);
        return this.lemonCoreService.request(method, endpoint, path, params, body);
    }

    public getIP() {
        return zip(
            from(this.httpClient.get('https://api.ipify.org/?format=json',{ responseType : 'json' })),
            from(this.httpClient.get('https://ip2c.org/self',{ responseType : 'text' }))
        ).pipe(
            map(res => {
                try {
                    return {
                        ip: res[0]['ip'],
                        country: res[1].split(';')[2].substring(0, 2).toLowerCase()
                    };
                } catch (e) {
                    return {
                        ip: '0.0.0.0',
                        country: 'ko'
                    };
                }
            }),
            take(1)
        );
    }

    public getChargeHistory(param) {
        return this.request1$('POST', environment.localUrl, '/client/payment/detail', param);
    }
}
