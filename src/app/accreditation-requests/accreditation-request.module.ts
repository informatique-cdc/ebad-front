import {NgModule} from '@angular/core';
import {SharedModule} from '../shared';
import {IconsModule} from '../icons';
import {NgbPaginationModule, NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";
import {AccreditationRequestComponent} from "./accreditation-request.component";
import {AccreditationRequestRoutingModule} from "./accreditation-request-routing.module";
import {ListAccreditationRequestComponent} from "./list-accreditation-request.component";

;

@NgModule({
  declarations: [AccreditationRequestComponent, ListAccreditationRequestComponent],
  imports: [
    AccreditationRequestRoutingModule,
    SharedModule,
    IconsModule,
    NgbPaginationModule,
    NgbTypeaheadModule
  ],
  exports: [
    AccreditationRequestComponent,
    ListAccreditationRequestComponent
  ],
  entryComponents: []
})
export class AccreditationRequestModule {
}
