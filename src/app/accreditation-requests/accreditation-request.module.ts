import {NgModule} from '@angular/core';
import {SharedModule} from '../shared';
import {IconsModule} from '../icons';
import {NgbPaginationModule, NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";
import {AccreditationRequestComponent} from "./accreditation-request.component";
import {AccreditationRequestRoutingModule} from "./accreditation-request-routing.module";
import {UserListAccreditationRequestComponent} from "./user-list-accreditation-request.component";
import {ResponseAccreditationRequestComponent} from "./response-accreditation-request.component";

;

@NgModule({
  declarations: [AccreditationRequestComponent, UserListAccreditationRequestComponent, ResponseAccreditationRequestComponent],
  imports: [
    AccreditationRequestRoutingModule,
    SharedModule,
    IconsModule,
    NgbPaginationModule,
    NgbTypeaheadModule
  ],
  exports: [
    AccreditationRequestComponent,
    UserListAccreditationRequestComponent,
    ResponseAccreditationRequestComponent
  ],
  entryComponents: []
})
export class AccreditationRequestModule {
}
