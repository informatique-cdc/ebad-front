import {NgModule} from '@angular/core';
import {ManageEnvironmentsComponent} from './manage-environments.component';
import {ManageEnvironmentsRoutingModule} from './manage-environments-routing.module';
import {SharedModule} from '../shared';
import {ModalEnvironmentComponent} from './modal-environment/modal-environment.component';
import {ModalEnvironmentDeletionComponent} from './modal-environment-deletion/modal-environment-deletion.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import {ModalEnvironmentTerminalComponent} from './modal-environment-terminal/modal-environment-terminal.component';
import {NgTerminalModule} from 'ng-terminal';
import {NgxResize} from 'ngx-resize';

@NgModule({
    declarations: [
        ManageEnvironmentsComponent,
        ModalEnvironmentComponent,
        ModalEnvironmentDeletionComponent,
        ModalEnvironmentTerminalComponent
    ],
    imports: [
        ManageEnvironmentsRoutingModule,
        SharedModule,
        NgbModule,
        DataTablesModule,
        NgTerminalModule,
        NgxResize,
    ]
})
export class ManageEnvironmentsModule {
}
