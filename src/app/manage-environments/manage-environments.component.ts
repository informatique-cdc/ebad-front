import {Component, OnInit} from '@angular/core';
import {Action, ColumnsDefinition, Table} from '../shared/table/table.model';
import {Application} from '../core/models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotifierService} from 'angular-notifier';
import {ActionClickEvent} from '../shared/table/action-click-event.model';
import {ApplicationsService, EnvironmentsService} from '../core/services';
import {ModalEnvironmentComponent} from './modal-environment/modal-environment.component';
import {ModalEnvironmentDeletionComponent} from './modal-environment-deletion/modal-environment-deletion.component';
import {Pageable} from "../core/models/pageable.model";
import {Constants} from "../shared/Constants";

@Component({
  selector: 'app-manage-environments',
  templateUrl: './manage-environments.component.html',
  styleUrls: ['./manage-environments.component.scss']
})
export class ManageEnvironmentsComponent implements OnInit {
  table: Table;
  applicationSelected: Application;

  size = this.constants.numberByPage;
  page = 0;
  totalSize = 0;

  private idActionModify = 'actionModify';
  private idActionDelete = 'actionDelete';

  constructor(private environmentsService: EnvironmentsService,
              private modalService: NgbModal,
              private applicationsService: ApplicationsService,
              private constants: Constants,
              private notifierService: NotifierService) {
  }

  ngOnInit() {
  }

  applicationChanged(application: Application) {
    this.showEnvironments();
    this.applicationSelected = application;
    this.applicationsService.getAllModerable().subscribe(
      apps => {
        for (const app of apps.content) {
          if (app.id === this.applicationSelected.id) {
            this.page = 1;
            this.refreshEnvironments(new Pageable(this.page - 1, this.size))
          }
        }
      }
    );
  }

  refreshEnvironments(pageable?: Pageable) {
    this.environmentsService.getEnvironmentFromApp(this.applicationSelected.id,pageable).subscribe(
      (environmentsPage) => {
        this.table.items = environmentsPage.content;
        this.totalSize = environmentsPage.totalElements;
      }
    );
  }

  showEnvironments() {
    this.table = new Table();
    this.table.showHeader = false;
    this.table.showFooter = true;

    this.table.settings.globalAction = new Action('Ajouter un environnement', '');

    this.table.settings.columnsDefinition.id = new ColumnsDefinition();
    this.table.settings.columnsDefinition.id.title = 'Id';
    this.table.settings.columnsDefinition.id.order = 1;
    this.table.settings.columnsDefinition.name = new ColumnsDefinition();
    this.table.settings.columnsDefinition.name.title = 'Nom';
    this.table.settings.columnsDefinition.name.order = 2;
    this.table.settings.columnsDefinition.host = new ColumnsDefinition();
    this.table.settings.columnsDefinition.host.title = 'Serveur';
    this.table.settings.columnsDefinition.host.order = 3;
    this.table.settings.columnsDefinition.login = new ColumnsDefinition();
    this.table.settings.columnsDefinition.login.title = 'Login';
    this.table.settings.columnsDefinition.login.order = 4;
    this.table.settings.columnsDefinition.homePath = new ColumnsDefinition();
    this.table.settings.columnsDefinition.homePath.title = 'Home';
    this.table.settings.columnsDefinition.homePath.order = 6;
    this.table.settings.columnsDefinition.prefix = new ColumnsDefinition();
    this.table.settings.columnsDefinition.prefix.title = 'Préfix';
    this.table.settings.columnsDefinition.prefix.order = 7;

    this.table.settings.actionsDefinition.title = 'Action';
    this.table.settings.actionsDefinition.actions.push(new Action('Modifier', this.idActionModify));
    this.table.settings.actionsDefinition.actions.push(new Action('Supprimer', this.idActionDelete));
  }

  onClickAddEnvironment() {
    const modalRef = this.modalService.open(ModalEnvironmentComponent);
    modalRef.result.then((result) => {
      this.notifierService.notify('success', `L'environnement ${result.name} a bien été ajouté`);
      this.applicationChanged(this.applicationSelected);
    }, (reason) => {
      if (reason.message !== undefined) {
        this.notifierService.notify('error', `Une erreur est survenue lors de l'ahout de l'environnement : ${reason.message}`);
      }
    });
    modalRef.componentInstance.application = this.applicationSelected;
    modalRef.componentInstance.isUpdate = false;
  }

  onActionClicked(event: ActionClickEvent) {
    if (event.id === this.idActionModify) {
      const modalRef = this.modalService.open(ModalEnvironmentComponent);
      modalRef.result.then((result) => {
        this.notifierService.notify('success', `L'environnement ${result.name} a bien été modifié`);
        this.applicationChanged(this.applicationSelected);
      }, (reason) => {
        if (reason.message !== undefined) {
          this.notifierService.notify('error', `Une erreur est survenue lors de la modification de l'environnement : ${reason.message}`);
        }
      });
      modalRef.componentInstance.application = this.applicationSelected;
      modalRef.componentInstance.environment = event.item;
      modalRef.componentInstance.isUpdate = true;
    }

    if (event.id === this.idActionDelete) {
      const modalRef = this.modalService.open(ModalEnvironmentDeletionComponent);
      modalRef.result.then((result) => {
        this.environmentsService.deleteEnvironemnt(event.item.id).subscribe(
          fileKind => {
            this.notifierService.notify('success', `L'environnement a été supprimé`);
            this.applicationChanged(this.applicationSelected);
          },
          reason => {
            this.notifierService.notify('error', `Une erreur est survenue lors de la suppression de l'environnement : ${reason}`);
          }
        );
      }, reason => {
      });
      modalRef.componentInstance.application = this.applicationSelected;
      modalRef.componentInstance.environment = event.item;
      modalRef.componentInstance.isUpdate = true;
    }
  }

  onPageChange(event) {
    this.refreshEnvironments(new Pageable(this.page - 1, this.size))
  }
}
