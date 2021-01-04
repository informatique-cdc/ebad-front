import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Application} from '../../core/models';
import {FileKind} from '../../core/models/file-kind.model';
import {FileKindsService} from '../../core/services/file-kinds.service';

@Component({
  selector: 'app-modal-naming',
  templateUrl: './modal-naming.component.html'
})
export class ModalNamingComponent implements OnInit {
  application: Application;
  isUpdate = false;
  title = 'Ajouter un nommage';
  action = 'Ajouter';
  fileKind: FileKind;

  constructor(public activeModal: NgbActiveModal,
              private fileKindsService: FileKindsService) {
    this.fileKind = {
      id: undefined,
      name: undefined,
      application: this.application,
      pattern: undefined,
      createdBy: undefined,
      createdDate: undefined,
      lastModifiedBy: undefined,
      lastModifiedDate: undefined
    };
  }

  ngOnInit() {
    if (this.isUpdate) {
      this.title = `Modifier le nommage ${this.fileKind.name}`;
      this.action = `Modifier`;
    }
  }

  addNaming() {
    if (!this.isUpdate) {
      this.fileKind.application = this.application;
      this.fileKindsService.addNaming(this.fileKind).subscribe(
        fileKind => {
          this.activeModal.close(fileKind);
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    } else {
      this.fileKindsService.updateNaming(this.fileKind).subscribe(
        fileKind => {
          this.activeModal.close(fileKind);
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    }
  }
}
