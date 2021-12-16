import {NgModule} from '@angular/core';
import {AdminUsersRoutingModule} from './admin-users-routing.module';
import {SharedModule} from '../shared';
import {AdminUsersComponent} from './admin-users.component';
import {ModalUserComponent} from './modal-user/modal-user.component';
import {IconsModule} from '../icons';
import {ModalRolesComponent} from './modal-roles/modal-roles.component';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
    declarations: [AdminUsersComponent, ModalUserComponent, ModalRolesComponent],
    imports: [
        AdminUsersRoutingModule,
        SharedModule,
        IconsModule,
        NgxPaginationModule
    ]
})
export class AdminUsersModule { }
