import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FileKind} from '../../core/models/file-kind.model';
import {FileKindsService} from '../../core/services/file-kinds.service';
import {Application} from '../../core/models';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-modal-rename',
  templateUrl: './modal-rename.component.html'
})
export class ModalRenameComponent implements OnInit {

  fileKinds: FileKind[];
  fileKindSelected: FileKind;
  file: File;
  application: Application;

  constructor(public activeModal: NgbActiveModal,
              private fileKindsService: FileKindsService,
              private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.fileKindsService.getAllFromApplication(this.application.id).subscribe(
      (data) => {
        this.fileKinds = data.content;
      }
    );
  }

  changeName() {
    const currentDate = new Date();
    const name = this.fileKindSelected.pattern.replace('$1', this.datePipe.transform(currentDate, 'ddMMyyyy_HHmm'));
    this.activeModal.close(name);
  }
}
