import {NgModule} from '@angular/core';
import {AdminApplicationsRoutingModule} from './admin-applications-routing.module';
import {SharedModule} from '../shared';
import {AdminApplicationsComponent} from './admin-applications.component';
import {ModalApplicationComponent} from './modal-application/modal-application.component';
import {ModalUsersComponent} from './modal-users/modal-users.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {IconsModule} from '../icons';
import {ModalApplicationDeletionComponent} from './modal-application-deletion/modal-application-deletion.component';
import {DataTablesModule} from 'angular-datatables';
import {NgxResize} from 'ngx-resize';


@NgModule({
    declarations: [AdminApplicationsComponent, ModalApplicationComponent, ModalUsersComponent, ModalApplicationDeletionComponent],
    imports: [
        AdminApplicationsRoutingModule,
        SharedModule,
        NgbModule,
        IconsModule,
        DataTablesModule,
        NgxResize,
    ]
})
export class AdminApplicationsModule {
}
