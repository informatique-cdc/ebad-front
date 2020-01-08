import {NgModule} from '@angular/core';
import {ManageDirectoriesComponent} from './manage-directories.component';
import {SharedModule} from '../shared';
import {ManageDirectoriesRoutingModule} from './manage-directories-routing.module';
import {ModalDirectoryComponent} from './modal-directory/modal-directory.component';
import {ModalDirectoryDeletionComponent} from './modal-directory-deletion/modal-directory-deletion.component';
import {DataTablesModule} from "angular-datatables";

@NgModule({
  declarations: [ManageDirectoriesComponent, ModalDirectoryComponent, ModalDirectoryDeletionComponent],
  imports: [
    SharedModule,
    ManageDirectoriesRoutingModule,
    DataTablesModule
  ],
  entryComponents: [
    ModalDirectoryComponent,
    ModalDirectoryDeletionComponent
  ]
})
export class ManageDirectoriesModule {
}
