import {NgModule} from '@angular/core';
import {ManageNamingComponent} from './manage-naming.component';
import {ManageNamingRoutingModule} from './manage-naming-routing.module';
import {SharedModule} from '../shared';
import {ModalNamingComponent} from './modal-naming/modal-naming.component';
import {ModalNamingDeletionComponent} from './modal-naming-deletion/modal-naming-deletion.component';
import {DataTablesModule} from "angular-datatables";

@NgModule({
  declarations: [ManageNamingComponent, ModalNamingDeletionComponent, ModalNamingComponent],
  imports: [
    ManageNamingRoutingModule,
    SharedModule,
    DataTablesModule
  ],
  entryComponents: [
    ModalNamingComponent,
    ModalNamingDeletionComponent
  ]
})
export class ManageNamingModule {
}
