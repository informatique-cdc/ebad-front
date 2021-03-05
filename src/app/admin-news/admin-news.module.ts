import {NgModule} from '@angular/core';
import {AdminNewsComponent} from './admin-news.component';
import {AdminNewsRoutingModule} from './admin-news-routing.module';
import {SharedModule} from '../shared';
import {ModalNewComponent} from './modal-new/modal-new.component';
import {ModalNewDeletionComponent} from './modal-new-deletion/modal-new-deletion.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {NgbPaginationModule, NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import {AngularResizedEventModule} from "angular-resize-event";


@NgModule({
  declarations: [AdminNewsComponent, ModalNewComponent, ModalNewDeletionComponent],
  imports: [
    AdminNewsRoutingModule,
    SharedModule,
    CKEditorModule,
    NgbPaginationModule,
    DataTablesModule,
    NgbToastModule,
    AngularResizedEventModule
  ],
  entryComponents: [
    ModalNewDeletionComponent,
    ModalNewComponent
  ]
})
export class AdminNewsModule {
}
