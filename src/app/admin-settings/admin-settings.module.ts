import {NgModule} from '@angular/core';

import {AdminSettingsComponent} from './admin-settings.component';
import {SharedModule} from '../shared';
import {AdminSettingsRoutingModule} from './admin-settings-routing.module';
import {ModalSettingsComponent} from './modal-settings/modal-settings.component';

@NgModule({
    imports: [
        SharedModule,
        AdminSettingsRoutingModule
    ],
    declarations: [
        AdminSettingsComponent,
        ModalSettingsComponent
    ]
})
export class AdminSettingsModule {}
