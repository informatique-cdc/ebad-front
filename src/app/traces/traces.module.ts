import {NgModule} from '@angular/core';
import {TracesComponent} from './traces.component';
import {TracesRoutingModule} from './traces-routing.module';
import {SharedModule} from '../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import {ModalLogComponent} from './modal-log/modal-log.component';
import {NgxResize} from 'ngx-resize';

@NgModule({
  declarations: [TracesComponent, ModalLogComponent],
  imports: [
    TracesRoutingModule,
    SharedModule,
    NgbModule,
    DataTablesModule,
    NgxResize,
  ]
})
export class TracesModule { }
