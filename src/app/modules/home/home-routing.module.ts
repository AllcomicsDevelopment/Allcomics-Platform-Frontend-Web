import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MainComponent } from './pages/main/main.component';
import { SearchComponent } from './pages/search/search.component';
import { SettingComponent } from './pages/setting/setting.component';
import { PrivacyComponent } from '@app/modules/home/pages/privacy/privacy.component';
import { YouthPrivacyComponent } from '@app/modules/home/pages/youth-privacy/youth-privacy.component';
import { PolicyComponent } from '@app/modules/home/pages/policy/policy.component';
import { NovelComponent } from '@app/modules/home/pages/novel/novel.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: MainComponent },
            { path: 'novel', component: NovelComponent },
            { path: 'search', component: SearchComponent },
            { path: 'setting', component: SettingComponent },
            { path: 'privacy', component: PrivacyComponent },
            { path: 'youth-privacy', component: YouthPrivacyComponent },
            { path: 'policy', component: PolicyComponent },
        ])
    ],
    exports: [RouterModule]
})
export class HomeRoutingModule {}
