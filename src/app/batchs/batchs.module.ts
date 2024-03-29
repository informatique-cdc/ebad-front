import {NgModule} from '@angular/core';
import {BatchsComponent} from './batchs.component';
import {BatchsRoutingModule} from './batchs-routing.module';
import {SharedModule} from '../shared';
import {IconsModule} from '../icons';
import {ModalRunWithParametersComponent} from './modal-run-with-parameters/modal-run-with-parameters.component';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import {NgxResize} from 'ngx-resize';


@NgModule({
    declarations: [BatchsComponent, ModalRunWithParametersComponent],
    imports: [
        BatchsRoutingModule,
        SharedModule,
        IconsModule,
        NgbPaginationModule,
        DataTablesModule,
        NgxResize,
    ]
})
export class BatchsModule { }
