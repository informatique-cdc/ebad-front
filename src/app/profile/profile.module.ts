import {NgModule} from '@angular/core';
import {ProfileComponent} from './profile.component';
import {ProfileRoutingModule} from './profile-routing.module';
import {SharedModule} from '../shared';
import {ModalTokenComponent} from './modal-token/modal-token.component';
import {ModalTokenDeletionComponent} from './modal-token-deletion/modal-token-deletion.component';
import {ModalTokenResultComponent} from './modal-token-result/modal-token-result.component';

@NgModule({
  declarations: [ProfileComponent, ModalTokenComponent, ModalTokenDeletionComponent, ModalTokenResultComponent],
  imports: [
    ProfileRoutingModule,
    SharedModule
  ],
  entryComponents: [
    ModalTokenComponent,
    ModalTokenDeletionComponent,
    ModalTokenResultComponent
  ]
})
export class ProfileModule {
}
