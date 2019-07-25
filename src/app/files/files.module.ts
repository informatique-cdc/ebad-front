import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesComponent } from './files.component';
import {FilesRoutingModule} from './files-routing.module';
import {SharedModule} from '../shared';
import {FileDropModule} from 'ngx-file-drop';
import {ModalRenameComponent} from './modal-rename/modal-rename.component';

@NgModule({
  declarations: [FilesComponent, ModalRenameComponent],
  imports: [
    FilesRoutingModule,
    SharedModule,
    FileDropModule
  ],
  entryComponents: [
    ModalRenameComponent
  ]
})
export class FilesModule { }
