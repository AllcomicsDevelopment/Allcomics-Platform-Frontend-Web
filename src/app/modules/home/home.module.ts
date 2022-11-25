import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';

import { SharedModule } from '@shared/shared.module';

import { MainComponent } from './pages/main/main.component';
import { SearchComponent } from './pages/search/search.component';
import { SettingComponent } from './pages/setting/setting.component';
import { PrivacyComponent } from '@app/modules/home/pages/privacy/privacy.component';
import { YouthPrivacyComponent } from '@app/modules/home/pages/youth-privacy/youth-privacy.component';
import { PolicyComponent } from '@app/modules/home/pages/policy/policy.component';

import { ClearCacheDialogComponent } from './components/clear-cache-dialog/clear-cache-dialog.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { homeReducer } from '@app/modules/home/store/home.reducer';
import { HomeEffects } from '@app/modules/home/store/home.effects';

import { searchReducer } from '@app/modules/home/store/search/search.reducer';
import { SearchEffects } from '@app/modules/home/store/search/search.effects';
import { NovelComponent } from '@app/modules/home/pages/novel/novel.component';
import {novelReducer} from '@app/modules/home/store/novel/novel.reducer';
import {NovelEffects} from '@app/modules/home/store/novel/novel.effects';

@NgModule({
    imports: [
        SharedModule,
        HomeRoutingModule,
        StoreModule.forFeature('home', homeReducer),
        StoreModule.forFeature('novel', novelReducer),
        StoreModule.forFeature('search', searchReducer),
        EffectsModule.forFeature([
            HomeEffects,
            NovelEffects,
            SearchEffects
        ])
    ],
    declarations: [
        // pages
        MainComponent,
        NovelComponent,
        SearchComponent,
        SettingComponent,
        PrivacyComponent,
        YouthPrivacyComponent,
        PolicyComponent,
        // components
        ClearCacheDialogComponent,
    ],
    entryComponents: [
        ClearCacheDialogComponent,
    ]
})
export class HomeModule { }
