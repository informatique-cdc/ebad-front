import {NgModule} from '@angular/core';
import {ChainsComponent} from './chains.component';
import {ChainsRoutingModule} from './chains-routing.module';
import {SharedModule} from '../shared';
import {DataTablesModule} from 'angular-datatables';
import {AngularResizeEventModule} from 'angular-resize-event';

@NgModule({
  declarations: [ChainsComponent],
  imports: [
    ChainsRoutingModule,
    SharedModule,
    DataTablesModule,
    AngularResizeEventModule
  ]
})
export class ChainsModule { }
