import {NgModule} from '@angular/core';
import {SharedModule} from '../shared';
import {IconsModule} from '../icons';
import {NgbPaginationModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {AccreditationRequestRoutingModule} from './accreditation-request-routing.module';
import {ListAccreditationRequestComponent} from './list-accreditation-request.component';
import {SynthesisAccreditationRequestComponent} from './synthesis-accreditation-request.component';
import {ModalRequestComponent} from './modal-request/modal-request.component';
import {DataTablesModule} from 'angular-datatables';
import {NgxResize} from 'ngx-resize';



@NgModule({
    declarations: [
        ListAccreditationRequestComponent,
        SynthesisAccreditationRequestComponent,
        ModalRequestComponent
    ],
    imports: [
        AccreditationRequestRoutingModule,
        SharedModule,
        IconsModule,
        NgbPaginationModule,
        NgbTypeaheadModule,
        DataTablesModule,
        NgxResize,
    ],
    exports: [
        ListAccreditationRequestComponent,
        SynthesisAccreditationRequestComponent
    ]
})
export class AccreditationRequestModule {
}
