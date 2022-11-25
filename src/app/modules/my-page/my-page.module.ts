import { NgModule } from '@angular/core';
import { MyPageRoutingModule } from './my-page-routing.module';

import { SharedModule } from '@shared/shared.module';

import { MyFavoriteComponent } from './pages/my-favorite/my-favorite.component';
import { MyLibraryComponent } from './pages/my-library/my-library.component';
import { PurchaseListComponent } from './pages/purchase-list/purchase-list.component';

import { StoreModule} from '@ngrx/store';
import { EffectsModule} from '@ngrx/effects';
import { myPageReducer } from '@app/modules/my-page/store/my-page.reducer';
import { MyPageEffects } from '@app/modules/my-page/store/my-page.effects';

@NgModule({
    imports: [
        SharedModule,
        MyPageRoutingModule,
        StoreModule.forFeature('my-page', myPageReducer),
        EffectsModule.forFeature([MyPageEffects]),
    ],
    declarations: [
        // pages
        MyFavoriteComponent,
        MyLibraryComponent,
        PurchaseListComponent,
    ],
})
export class MyPageModule { }
