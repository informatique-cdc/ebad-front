import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NormsService, Norme} from '../../core';

@Component({
  selector: 'app-modal-norm',
  templateUrl: './modal-norm.component.html'
})
export class ModalNormComponent implements OnInit {
  isUpdate = false;
  title = 'Ajouter une norme';
  action = 'Ajouter';
  norm: Norme = {
    id: undefined,
    name: undefined,
    commandLine: undefined,
    ctrlMDate: undefined,
    pathShell: undefined,
    createdBy: undefined,
    createdDate: undefined,
    lastModifiedBy: undefined,
    lastModifiedDate: undefined
  };

  constructor(public activeModal: NgbActiveModal,
              private normsService: NormsService) {
  }

  ngOnInit() {
    if (this.isUpdate) {
      this.title = `Modifier la norme ${this.norm.name}`;
      this.action = `Modifier`;
    }
  }

  addNorm() {
    if (!this.isUpdate) {
      this.normsService.addNorm(this.norm).subscribe(
        () => {
          this.activeModal.close();
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    } else {
      this.normsService.updateNorm(this.norm).subscribe(
        norm => {
          this.activeModal.close(norm);
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    }
  }
}
