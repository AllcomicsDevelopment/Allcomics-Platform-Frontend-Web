import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyLibraryComponent } from './pages/my-library/my-library.component';
import { MyFavoriteComponent } from './pages/my-favorite/my-favorite.component';
import { PurchaseListComponent } from './pages/purchase-list/purchase-list.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: MyLibraryComponent },
            { path: 'purchase', component: PurchaseListComponent },
            { path: 'favorite', component: MyFavoriteComponent },
        ])
    ],
    exports: [RouterModule]
})
export class MyPageRoutingModule {}
