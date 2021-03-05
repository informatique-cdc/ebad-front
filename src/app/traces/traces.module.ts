import {NgModule} from '@angular/core';
import {TracesComponent} from './traces.component';
import {TracesRoutingModule} from './traces-routing.module';
import {SharedModule} from '../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import {AngularResizedEventModule} from "angular-resize-event";

@NgModule({
  declarations: [TracesComponent],
  imports: [
    TracesRoutingModule,
    SharedModule,
    NgbModule,
    DataTablesModule,
    AngularResizedEventModule
  ]
})
export class TracesModule { }
