import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Application} from '../../core/models';
import {ApplicationsService} from '../../core/services';

@Component({
  selector: 'app-modal-application',
  templateUrl: './modal-application.component.html'
})
export class ModalApplicationComponent implements OnInit {
  isUpdate = false;
  title = 'Ajouter une application';
  action = 'Ajouter';
  application: Application = {
    id: undefined,
    name: undefined,
    code: undefined,
    dateFichierPattern: undefined,
    dateParametrePattern: undefined,
    environnements: [],
    createdBy: undefined,
    createdDate: undefined,
    lastModifiedBy: undefined,
    lastModifiedDate: undefined
  };

  constructor(public activeModal: NgbActiveModal,
              private applicationsService: ApplicationsService) {
  }

  ngOnInit() {
    if (this.isUpdate) {
      this.title = `Modifier l'application ${this.application.name} (${this.application.code})`;
      this.action = `Modifier`;
    }
  }

  addApplication() {
    if (!this.isUpdate) {
      this.applicationsService.addApplication(this.application).subscribe(
        application => {
          this.activeModal.close(application);
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    } else {
      this.applicationsService.updateApplication(this.application).subscribe(
        application => {
          this.activeModal.close(application);
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    }
  }
}
