import {NgModule} from '@angular/core';
import {SharedModule} from '../shared';
import {IconsModule} from '../icons';
import {NgbPaginationModule, NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";
import {AccreditationRequestComponent} from "./accreditation-request.component";
import {AccreditationRequestRoutingModule} from "./accreditation-request-routing.module";
import {ListAccreditationRequestComponent} from "./list-accreditation-request.component";
import {SynthesisAccreditationRequest} from "./synthesis-accreditation-request.component";

;

@NgModule({
  declarations: [AccreditationRequestComponent, ListAccreditationRequestComponent, SynthesisAccreditationRequest],
  imports: [
    AccreditationRequestRoutingModule,
    SharedModule,
    IconsModule,
    NgbPaginationModule,
    NgbTypeaheadModule
  ],
  exports: [
    AccreditationRequestComponent,
    ListAccreditationRequestComponent,
    SynthesisAccreditationRequest
  ],
  entryComponents: []
})
export class AccreditationRequestModule {
}
