import {NgModule} from '@angular/core';
import {AdminNormsComponent} from './admin-norms.component';
import {AdminNormsRoutingModule} from './admin-norms-routing.module';
import {SharedModule} from '../shared';
import {ModalNormComponent} from './modal-identity/modal-norm.component';
import {ModalNormDeletionComponent} from './modal-identity-deletion/modal-norm-deletion.component';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import {AngularResizedEventModule} from "angular-resize-event";

@NgModule({
  declarations: [AdminNormsComponent, ModalNormComponent, ModalNormDeletionComponent],
  imports: [
    AdminNormsRoutingModule,
    SharedModule,
    NgbPaginationModule,
    DataTablesModule,
    AngularResizedEventModule
  ],
  entryComponents: [
    ModalNormDeletionComponent,
    ModalNormComponent
  ]
})
export class AdminNormsModule {
}
