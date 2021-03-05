import {NgModule} from '@angular/core';
import {SchedulingsComponent} from './schedulings.component';
import {SchedulingsRoutingModule} from './schedulings-routing.module';
import {SharedModule} from '../shared';
import {IconsModule} from '../icons';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import {ModalAddSchedulingComponent} from './modal-add-scheduling/modal-add-scheduling.component';
import {AngularResizedEventModule} from "angular-resize-event";

@NgModule({
  declarations: [SchedulingsComponent, ModalAddSchedulingComponent],
  imports: [
    SchedulingsRoutingModule,
    SharedModule,
    IconsModule,
    NgbPaginationModule,
    DataTablesModule,
    AngularResizedEventModule
  ],
  entryComponents: [
    ModalAddSchedulingComponent
  ]
})
export class SchedulingsModule { }
