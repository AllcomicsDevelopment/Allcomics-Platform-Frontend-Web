import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainTemplateComponent } from './@layout/main-template/main-template.component';

const routes: Routes = [
    { path: 'home', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule), component: MainTemplateComponent },
    { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule), component: MainTemplateComponent },
    { path: 'payment', loadChildren: () => import('./modules/payment/payment.module').then(m => m.PaymentModule), component: MainTemplateComponent },
    { path: 'support', loadChildren: () => import('./modules/support/support.module').then(m => m.SupportModule), component: MainTemplateComponent },
    { path: 'event', loadChildren: () => import('./modules/event/event.module').then(m => m.EventModule), component: MainTemplateComponent },
    { path: 'webtoon', loadChildren: () => import('./modules/webtoon/webtoon.module').then(m => m.WebtoonModule), component: MainTemplateComponent },
    { path: 'genres', loadChildren: () => import('./modules/webtoon/webtoon.module').then(m => m.WebtoonModule), component: MainTemplateComponent },
    { path: 'novel', loadChildren: () => import('./modules/novel/webnovel.module').then(m => m.NovelModule), component: MainTemplateComponent },
    { path: 'mypage', loadChildren: () => import('./modules/my-page/my-page.module').then(m => m.MyPageModule), component: MainTemplateComponent },
    { path: 'error', loadChildren: () => import('./modules/errors/errors.module').then(m => m.ErrorsModule) },

    { path: '**', redirectTo: 'home' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
