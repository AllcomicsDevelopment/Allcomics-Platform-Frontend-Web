import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MAT_BOTTOM_SHEET_DATA, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { AngularMaterialModule } from '../angular-material.module';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ClickOutsideModule } from 'ng-click-outside';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { ReplacePipe } from './pipes/replace.pipe';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';
import { AlertDialogComponent } from '@shared/components/alert-dialog/alert-dialog.component';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

const ALLCOMICS_PIPES = [
    ReplacePipe,
    SafeHtmlPipe,
];

const ALLCOMICS_COMPONENTS = [
    FooterComponent,
    HeaderComponent,
    LoginDialogComponent,
    AlertDialogComponent,
    LoaderComponent,
];

@NgModule({
    declarations: [
        ...ALLCOMICS_PIPES,
        ...ALLCOMICS_COMPONENTS,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        SwiperModule,
        FlexLayoutModule,
        ClickOutsideModule,
        DeviceDetectorModule.forRoot(),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: false
        }),
    ],
    exports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        SwiperModule,
        FlexLayoutModule,
        ClickOutsideModule,
        TranslateModule,
        ...ALLCOMICS_PIPES,
        ...ALLCOMICS_COMPONENTS,
    ],
    entryComponents: [
        ...ALLCOMICS_COMPONENTS,
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
                { provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {} },
            ],
        };
    }
}
