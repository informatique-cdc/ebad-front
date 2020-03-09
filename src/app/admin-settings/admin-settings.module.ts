import {NgModule} from '@angular/core';

import {AdminSettingsComponent} from './admin-settings.component';
import {SharedModule} from '../shared';
import {AdminSettingsRoutingModule} from './admin-settings-routing.module';

@NgModule({
  imports: [
    SharedModule,
    AdminSettingsRoutingModule
  ],
  declarations: [
    AdminSettingsComponent
  ]
})
export class AdminSettingsModule {}
