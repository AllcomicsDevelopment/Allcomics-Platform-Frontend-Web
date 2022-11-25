import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { EventRoutingModule } from './event-routing.module';

import { EventComponent } from './pages/event/event.component';
import { IdolComponent } from './pages/idol/idol.component';
import { IdolDialogComponent } from './components/idol-dialog/idol-dialog.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { eventReducer } from '@app/modules/event/store/event.reducer';
import { EventEffects } from '@app/modules/event/store/event.effects';

@NgModule({
    imports: [
        SharedModule,
        EventRoutingModule,
        StoreModule.forFeature('event', eventReducer),
        EffectsModule.forFeature([
            EventEffects,
        ])
    ],
    declarations: [
        EventComponent,
        IdolComponent,
        IdolDialogComponent,
    ],
    entryComponents: [
        IdolDialogComponent,
    ]
})
export class EventModule { }
