import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminUsersRoutingModule} from './admin-users-routing.module';
import {SharedModule} from '../shared';
import {AdminUsersComponent} from './admin-users.component';
import {ModalUserComponent} from './modal-user/modal-user.component';
import {IconsModule} from '../icons';

@NgModule({
  declarations: [AdminUsersComponent, ModalUserComponent],
  imports: [
    AdminUsersRoutingModule,
    SharedModule,
    IconsModule
  ],
  entryComponents: [
    ModalUserComponent
  ]
})
export class AdminUsersModule { }
