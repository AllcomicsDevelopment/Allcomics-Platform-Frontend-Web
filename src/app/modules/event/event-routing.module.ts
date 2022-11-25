import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventComponent } from './pages/event/event.component';
import { IdolComponent } from './pages/idol/idol.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: EventComponent },
            { path: 'idol', component: IdolComponent },
        ])
    ],
    exports: [RouterModule]
})
export class EventRoutingModule {}
