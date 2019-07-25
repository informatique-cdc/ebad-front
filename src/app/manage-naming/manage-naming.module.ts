import {NgModule} from '@angular/core';
import {ManageNamingComponent} from './manage-naming.component';
import {ManageNamingRoutingModule} from './manage-naming-routing.module';
import {SharedModule} from '../shared';
import {ModalNamingComponent} from './modal-naming/modal-naming.component';
import {ModalNamingDeletionComponent} from './modal-naming-deletion/modal-naming-deletion.component';

@NgModule({
  declarations: [ManageNamingComponent, ModalNamingDeletionComponent, ModalNamingComponent],
  imports: [
    ManageNamingRoutingModule,
    SharedModule
  ],
  entryComponents: [
    ModalNamingComponent,
    ModalNamingDeletionComponent
  ]
})
export class ManageNamingModule {
}
