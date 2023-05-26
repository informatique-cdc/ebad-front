import {NgModule} from '@angular/core';
import {AdminNormsComponent} from './admin-norms.component';
import {AdminNormsRoutingModule} from './admin-norms-routing.module';
import {SharedModule} from '../shared';
import {ModalNormComponent} from './modal-norm/modal-norm.component';
import {ModalNormDeletionComponent} from './modal-norm-deletion/modal-norm-deletion.component';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import {NgxResize} from 'ngx-resize';


@NgModule({
    declarations: [AdminNormsComponent, ModalNormComponent, ModalNormDeletionComponent],
    imports: [
        AdminNormsRoutingModule,
        SharedModule,
        NgbPaginationModule,
        DataTablesModule,
        NgxResize,
    ]
})
export class AdminNormsModule {
}
