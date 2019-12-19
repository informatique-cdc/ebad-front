import {Component, OnInit} from '@angular/core';
import {Action, ColumnsDefinition, Table} from '../shared/table/table.model';
import {ApplicationsService} from '../core/services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotifierService} from 'angular-notifier';
import {ActionClickEvent} from '../shared/table/action-click-event.model';
import {ModalApplicationComponent} from './modal-application/modal-application.component';
import {ModalUsersComponent} from './modal-users/modal-users.component';
import {ModalApplicationDeletionComponent} from './modal-application-deletion/modal-application-deletion.component';
import {Constants} from "../shared/Constants";
import {Pageable} from "../core/models/pageable.model";

@Component({
  selector: 'app-admin-applications',
  templateUrl: './admin-applications.component.html',
  styleUrls: ['./admin-applications.component.scss']
})
export class AdminApplicationsComponent implements OnInit {
  table: Table;
  size = this.constants.numberByPage;
  page = 0;
  totalSize = 0;

  private idActionModify = 'actionModify';
  private idActionDelete = 'actionDelete';
  private idActionUtilisateurs = 'actionUtilisateurs';
  private idActionGestionnaires = 'actionGestionnaires';

  constructor(private modalService: NgbModal,
              private applicationsService: ApplicationsService,
              private constants: Constants,
              private notifierService: NotifierService) {
  }

  ngOnInit() {
    this.showApplications();
  }

  showApplications() {
    this.table = new Table();
    this.table.showHeader = false;
    this.table.showFooter = true;

    this.table.settings.globalAction = new Action('Ajouter une application', '');

    this.table.settings.columnsDefinition.code = new ColumnsDefinition();
    this.table.settings.columnsDefinition.code.title = 'Code';
    this.table.settings.columnsDefinition.code.order = 1;
    this.table.settings.columnsDefinition.name = new ColumnsDefinition();
    this.table.settings.columnsDefinition.name.title = 'Nom';
    this.table.settings.columnsDefinition.name.order = 2;
    this.table.settings.columnsDefinition.dateParametrePattern = new ColumnsDefinition();
    this.table.settings.columnsDefinition.dateParametrePattern.title = 'Pattern paramètre';
    this.table.settings.columnsDefinition.dateParametrePattern.order = 3;
    this.table.settings.columnsDefinition.dateFichierPattern = new ColumnsDefinition();
    this.table.settings.columnsDefinition.dateFichierPattern.title = 'Pattern fichier';
    this.table.settings.columnsDefinition.dateFichierPattern.order = 4;

    this.table.settings.actionsDefinition.title = 'Action';
    this.table.settings.actionsDefinition.actions.push(new Action('Modifier', this.idActionModify));
    this.table.settings.actionsDefinition.actions.push(new Action('Supprimer', this.idActionDelete));
    this.table.settings.actionsDefinition.actions.push(new Action('Utilisateurs', this.idActionUtilisateurs));
    this.table.settings.actionsDefinition.actions.push(new Action('Gestionnaires', this.idActionGestionnaires));
    this.refreshApplication(new Pageable(this.page-1, this.size))
  }

  refreshApplication(pageable?: Pageable) {
    console.log(pageable);
    this.applicationsService.getAllManage(pageable).subscribe(
      (applications) => {
        this.table.items = applications.content;
        this.totalSize = applications.totalElements;
      }
    );
  }

  onClickAddApplication() {
    const modalRef = this.modalService.open(ModalApplicationComponent);
    modalRef.result.then((result) => {
      this.notifierService.notify('success', `L'application ${result.name} a bien été ajoutée`);
      this.page = 1;
    }, (reason) => {
      if (reason.message !== undefined) {
        this.notifierService.notify('error', `Une erreur est survenue lors de l'ajout de l'application : ${reason.message}`);
      }
    });
    modalRef.componentInstance.isUpdate = false;
  }

  onActionClicked(event: ActionClickEvent) {
    if (event.id === this.idActionModify) {
      const modalRef = this.modalService.open(ModalApplicationComponent);
      modalRef.result.then((result) => {
        this.notifierService.notify('success', `L'application ${result.name} a bien été modifiée`);
        this.page = 1;
      }, (reason) => {
        if (reason.message !== undefined) {
          this.notifierService.notify('error', `Une erreur est survenue lors de la modification de l'application : ${reason.message}`);
        }
      });
      modalRef.componentInstance.application = event.item;
      modalRef.componentInstance.isUpdate = true;
    }

    if (event.id === this.idActionDelete) {
      const modalRef = this.modalService.open(ModalApplicationDeletionComponent);
      modalRef.result.then((result) => {
        this.applicationsService.deleteApplication(event.item.id).subscribe(
          () => {
            this.notifierService.notify('success', `L'application a été supprimée`);
            this.page = 1;
          },
          reason => {
            this.notifierService.notify('error', `Une erreur est survenue lors de la suppression de l'application : ${reason}`);
          }
        );
      }, reason => {
      });
      modalRef.componentInstance.application = event.item;
    }

    if (event.id === this.idActionUtilisateurs) {
      const modalRef = this.modalService.open(ModalUsersComponent, {size: 'lg'});
      this.applicationsService.getUsersFromApplication(event.item.id)
        .subscribe(users => modalRef.componentInstance.usersApplication = users);
      modalRef.componentInstance.application = event.item;
    }

    if (event.id === this.idActionGestionnaires) {
      const modalRef = this.modalService.open(ModalUsersComponent, {size: 'lg'});
      this.applicationsService.getModeratorsFromApplication(event.item.id)
        .subscribe(users => modalRef.componentInstance.usersApplication = users);
      modalRef.componentInstance.application = event.item;
      modalRef.componentInstance.isModerator = true;
    }
  }

  onPageChange(event) {
    this.refreshApplication(new Pageable(this.page-1, this.size))
  }
}
