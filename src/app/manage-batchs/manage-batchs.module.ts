import {NgModule} from '@angular/core';
import {ManageBatchsComponent} from './manage-batchs.component';
import {SharedModule} from '../shared';
import {ManageBatchsRoutingModule} from './manage-batchs-routing.module';
import {ModalBatchComponent} from './modal-batch/modal-batch.component';
import {NgMultiselectDropdown3Module} from 'ng-multiselect-dropdown3';
import {ModalBatchDeletionComponent} from './modal-batch-deletion/modal-batch-deletion.component';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import {NgxResize} from 'ngx-resize';


@NgModule({
    declarations: [ManageBatchsComponent, ModalBatchComponent, ModalBatchDeletionComponent],
    imports: [
        SharedModule,
        ManageBatchsRoutingModule,
        NgMultiselectDropdown3Module,
        NgbPaginationModule,
        DataTablesModule,
        NgxResize,
    ]
})
export class ManageBatchsModule { }
