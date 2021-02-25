import {NgModule} from '@angular/core';
import {ManageBatchsComponent} from './manage-batchs.component';
import {SharedModule} from '../shared';
import {ManageBatchsRoutingModule} from './manage-batchs-routing.module';
import {ModalBatchComponent} from './modal-batch/modal-batch.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {ModalBatchDeletionComponent} from './modal-batch-deletion/modal-batch-deletion.component';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';

@NgModule({
  declarations: [ManageBatchsComponent, ModalBatchComponent, ModalBatchDeletionComponent],
  imports: [
    SharedModule,
    ManageBatchsRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbPaginationModule,
    DataTablesModule
  ],
  entryComponents: [
    ModalBatchComponent,
    ModalBatchDeletionComponent
  ]
})
export class ManageBatchsModule { }
