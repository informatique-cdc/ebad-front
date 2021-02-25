import {NgModule} from '@angular/core';

import {LoadingComponent} from './loading.component';
import {SharedModule} from '../shared';
import {LoadingRoutingModule} from './loading-routing.module';

@NgModule({
  imports: [
    SharedModule,
    LoadingRoutingModule,
  ],
  declarations: [
    LoadingComponent
  ]
})
export class LoadingModule {}
