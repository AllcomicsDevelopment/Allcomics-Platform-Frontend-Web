import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { from } from 'rxjs';
import { OAuthTokenResult } from '@core/services/device-helper.service';
import { LemonOAuthTokenResult } from '@lemoncloud/lemon-front-lib';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LemonAuthService extends BaseService {

    public getUserProfile() {
        return this.request('GET', this.OAUTH_ENDPOINT, '/user/0/profile');
    }

    public getUserProfile$() {
        return from(this.getUserProfile());
    }

    doSDKLoginWithToken(data: OAuthTokenResult) {
        return this.request('POST', this.OAUTH_ENDPOINT, `/oauth/0/native-token`, {}, this.deleteUndefinedProperty(data))
            .then((token: LemonOAuthTokenResult) => this.buildCredentialsByToken(token));
    }

    private deleteUndefinedProperty(query: any) {
        Object.keys(query).forEach(key => (query[key] === undefined || query[key] === '') && delete query[key]);
        return query;
    }

    public getUserSessionID(params: any) {
        console.log('KSL', 'signin', 'params', params);
        return this.request1$('POST', environment.localUrl, '/client/signin', { ...params});
    }
}
