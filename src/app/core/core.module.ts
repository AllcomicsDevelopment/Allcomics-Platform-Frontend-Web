import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { SWIPER_CONFIG, SwiperConfigInterface, SwiperModule } from 'ngx-swiper-wrapper';

// Interceptors
import { JwtInterceptor } from './interceptors/jwt.interceptor';

// Guards
import { EnsureModuleLoadedOnceGuard } from './guards/ensure-module-loaded-once.guard';

// Services
import { AuthenticationService } from './services/authentication.service';
import { BaseService } from './services/base.service';
import { ComicService } from './services/comic.service';
import { EventService } from './services/event.service';
import { SidenavService } from './services/sidenav.service';
import { WINDOW_PROVIDERS } from './services/window.service';
import { DeviceHelperService } from './services/device-helper.service';
import { LemonAuthService } from './services/lemon-auth.service';
import { LoaderService } from './services/loader.service';
import { ScrollService } from './services/scroll.service';
import { UtilsService } from '@core/services/utils.service';
import { RouterExtensionService } from '@core/services/router-extension.service';

const ALLCOMICS_SERVICES = [
    AuthenticationService,
    BaseService,
    ComicService,
    EventService,
    SidenavService,
    AuthenticationService,
    WINDOW_PROVIDERS,
    DeviceHelperService,
    LemonAuthService,
    LoaderService,
    ScrollService,
    UtilsService,
    RouterExtensionService,
];

const ALLCOMICS_GUARDS = [
];

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 'auto'
};


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        SwiperModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        {
            provide: SWIPER_CONFIG,
            useValue: DEFAULT_SWIPER_CONFIG
        },
        WINDOW_PROVIDERS,
        ...ALLCOMICS_SERVICES,
        ...ALLCOMICS_GUARDS,
    ]
})
export class CoreModule implements EnsureModuleLoadedOnceGuard {
    constructor(private routerExtensionService: RouterExtensionService) {
    }
}
