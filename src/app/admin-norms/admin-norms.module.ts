import {NgModule} from '@angular/core';
import {AdminNormsComponent} from './admin-norms.component';
import {AdminNormsRoutingModule} from './admin-norms-routing.module';
import {SharedModule} from '../shared';
import {ModalNormComponent} from './modal-norm/modal-norm.component';
import {ModalNormDeletionComponent} from './modal-norm-deletion/modal-norm-deletion.component';

@NgModule({
  declarations: [AdminNormsComponent, ModalNormComponent, ModalNormDeletionComponent],
  imports: [
    AdminNormsRoutingModule,
    SharedModule
  ],
  entryComponents: [
    ModalNormDeletionComponent,
    ModalNormComponent
  ]
})
export class AdminNormsModule {
}
