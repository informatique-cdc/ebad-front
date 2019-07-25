import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Application, Environment, Norme} from '../../core/models';
import {EnvironmentsService, NormsService} from '../../core/services';

@Component({
  selector: 'app-modal-environment',
  templateUrl: './modal-environment.component.html'
})
export class ModalEnvironmentComponent implements OnInit {
  application: Application;
  isUpdate = false;
  title = 'Ajouter un environnement';
  action = 'Ajouter';
  normes: Norme[];
  environment: Environment = {
    id: undefined,
    name: undefined,
    homePath: undefined,
    host: undefined,
    login: undefined,
    norme: null,
    application: this.application,
    prefix: undefined,
    createdBy: undefined,
    createdDate: undefined,
    lastModifiedBy: undefined,
    lastModifiedDate: undefined
  };

  constructor(public activeModal: NgbActiveModal,
              private environmentsService: EnvironmentsService,
              private normesService: NormsService) {
  }

  ngOnInit() {
    if (this.isUpdate) {
      this.title = `Modifier l'environnement ${this.environment.name}`;
      this.action = `Modifier`;
    }

    this.normesService.getAll().subscribe(
      normes => {
        this.normes = normes;
        if (this.isUpdate) {
          for (const norme of normes) {
            if (norme.id === this.environment.norme.id) {
              this.environment.norme = norme;
            }
          }
        }
      }
    );
  }

  addEnvironment() {
    this.environment.application = this.application;

    if (!this.isUpdate) {
      this.environmentsService.addEnvironment(this.environment).subscribe(
        fileKind => {
          this.activeModal.close(fileKind);
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    } else {
      this.environmentsService.updateEnvironment(this.environment).subscribe(
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
