import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LemonAuthService } from '@core/services/lemon-auth.service';
import { ComicService } from '@core/services/comic.service';
import { LoaderService } from '@core/services/loader.service';

import { Store } from '@ngrx/store';
import * as fromRoot from '@app/store/root/root.reducer';
import * as RootActions from '@app/store/root/root.actions';

import {from, of, ReplaySubject, zip} from 'rxjs';
import {map, mergeMap, switchMap, takeUntil} from 'rxjs/operators';
import {environment} from '@environments/environment';


@Component({
    selector: 'app-oauth-response',
    templateUrl: './oauth-response.component.html',
    styleUrls: ['./oauth-response.component.scss'],
})
export class OauthResponseComponent implements OnInit, OnDestroy {

    public routeParams;
    public data;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private lemonAuthService: LemonAuthService,
                private comicService: ComicService,
                private loaderService: LoaderService,
                private rootStore$: Store<fromRoot.State>) {
        // error case
        // 'http://localhost:4200/auth/oauth-response' +
        // '?error_description=Permissions%20error;%20error%3Daccess_denied;%20error_code%3D200;%20error_reason%3Duser_denied' +
        // '&error=access_denied#_=_'

        // success
        // 'http://localhost:4200/auth/oauth-response' +
        // '?code=....'
    }

    ngOnInit() {
        this.loaderService.show();
        this.routeParams = this.activatedRoute.snapshot.queryParams;
        this.data = this.activatedRoute.snapshot.data;
        this.checkLoginResult(this.routeParams);
    }

    ngOnDestroy() {
        this.loaderService.hide();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    private checkLoginResult(params: any) {
        const { code, provider } = params;
        const isError = !(typeof code === 'string' && code.length > 5);
        if (isError) {
            this.router.navigate(['/auth/login']);
            return;
        }

        const getUserInfo$ = from(this.lemonAuthService.createCredentialsByProvider(provider, code)).pipe(
            switchMap(() => this.lemonAuthService.getCredentials$()),
            switchMap(() => {
                const _data = zip(this.lemonAuthService.getUserProfile$(), this.comicService.getTDNBalance());
                return _data;
            }),
            map(([profile, tdn]) => {
                return ({...profile, tdn});
            }),
            takeUntil(this.destroyed$)
        );

        getUserInfo$.subscribe(profileWithTDN => {
            const _provider = profileWithTDN.Account.stereo;
            let email = '';

            if (_provider === 'kakao') {
                email = profileWithTDN.accountId + '@kakao.com';
            } else {
                email = profileWithTDN.User.email;
            }

            zip(this.lemonAuthService.getIP(), this.lemonAuthService.getUserSessionID({provider: _provider, user_email: email, user_name: profileWithTDN.User.name})).subscribe(([ip_info, data]) => {
                const _param = {
                    user_id : data['body'].data.data.user_id,
                    ip_addr: ip_info.ip
                };

                this.lemonAuthService.request1('POST', environment.localUrl, '/client/auth/session', _param).then(res => {
                    localStorage.setItem('session_token', res['body'].data.data.session_token);

                    this.rootStore$.dispatch(RootActions.SetProfile({ profile: profileWithTDN }));
                    const hasRedirectPath = this.routeParams.hasOwnProperty('redirectPath');
                    if (hasRedirectPath) {
                        const { redirectPath } = this.routeParams;
                        this.router.navigate(['/'], { replaceUrl: true }).then(() => this.router.navigate([`${redirectPath}`]));
                    } else {
                        this.router.navigate(['/'], { replaceUrl: true });
                    }
                });
            });
        });
    }
}
