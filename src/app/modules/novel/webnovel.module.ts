import { NgModule } from '@angular/core';
import { WebnovelRoutingModule } from './webnovel-routing.module';

import { SharedModule } from '@shared/shared.module';

import { GenreByWebtoonComponent } from './pages/genre-by-webtoon/genre-by-webtoon.component';
import { WorkViewComponent } from './pages/work-view/work-view.component';
import { WorkDetailComponent } from './pages/work-detail/work-detail.component';

import { DetailDialogComponent } from './components/detail-dialog/detail-dialog.component';
import { ToBillingDialogComponent } from './components/to-billing-dialog/to-billing-dialog.component';
import { StoreModule } from '@ngrx/store';

import { WebtoonEffects } from './store/webtoon/webtoon.effects';
import { webtoonReducer } from './store/webtoon/webtoon.reducer';
import { EpisodeEffects } from './store/episode/episode.effects';
import { episodeReducer } from './store/episode/episode.reducer';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
    imports: [
        SharedModule,
        WebnovelRoutingModule,
        StoreModule.forFeature('novel', webtoonReducer),
        StoreModule.forFeature('nepisode', episodeReducer),
        EffectsModule.forFeature([ WebtoonEffects, EpisodeEffects ]),
    ],
    declarations: [
        // pages
        GenreByWebtoonComponent,
        WorkViewComponent,
        WorkDetailComponent,
        // components
        DetailDialogComponent,
        ToBillingDialogComponent,
    ],
    entryComponents: [
        DetailDialogComponent,
        ToBillingDialogComponent,
    ]
})
export class NovelModule { }
