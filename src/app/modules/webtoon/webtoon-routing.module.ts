import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GenreByWebtoonComponent } from './pages/genre-by-webtoon/genre-by-webtoon.component';
import { WorkViewComponent } from './pages/work-view/work-view.component';
import { WorkDetailComponent } from './pages/work-detail/work-detail.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: ':contentId', component: GenreByWebtoonComponent },
            { path: 'detail/:titleId', component: WorkDetailComponent },
            { path: 'view/:titleId/:episodeId', component: WorkViewComponent },
        ])
    ],
    exports: [RouterModule]
})
export class WebtoonRoutingModule {}
