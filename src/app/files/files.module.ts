import {NgModule} from '@angular/core';
import {FilesComponent} from './files.component';
import {FilesRoutingModule} from './files-routing.module';
import {SharedModule} from '../shared';
import {ModalRenameComponent} from './modal-rename/modal-rename.component';
import {NgxFileDropModule} from 'ngx-file-drop';
import {DataTablesModule} from 'angular-datatables';
import {AngularResizedEventModule} from "angular-resize-event";

@NgModule({
  declarations: [FilesComponent, ModalRenameComponent],
  imports: [
    FilesRoutingModule,
    SharedModule,
    NgxFileDropModule,
    DataTablesModule,
    AngularResizedEventModule
  ],
  entryComponents: [
    ModalRenameComponent
  ]
})
export class FilesModule { }
