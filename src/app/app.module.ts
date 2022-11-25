import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '@environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';

import { RouterEffects } from './store/router/router.effects';
import { RouterSerializer } from './store/router/router.reducer';
import { RootEffects } from './store/root/root.effects';
import { rootReducer } from './store/root/root.reducer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { LayoutModule } from './@layout/layout.module';
import { ErrorsModule } from '@app/modules/errors/errors.module';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: false
        }),
        CoreModule,
        // ErrorsModule,
        SharedModule.forRoot(),
        LayoutModule,
        HttpClientModule,

        StoreModule.forRoot({ root: rootReducer, router: routerReducer }),
        StoreRouterConnectingModule.forRoot({
            serializer: RouterSerializer
        }),
        EffectsModule.forRoot([
            RootEffects,
            RouterEffects
        ]),
        environment.production ? [] : StoreDevtoolsModule.instrument(),
    ],
    bootstrap: [
        AppComponent
    ],
})
export class AppModule { }

