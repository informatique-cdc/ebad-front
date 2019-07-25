import {Component, OnInit} from '@angular/core';
import {Action, ColumnsDefinition, Table} from '../shared/table/table.model';
import {Application} from '../core/models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotifierService} from 'angular-notifier';
import {ActionClickEvent} from '../shared/table/action-click-event.model';
import {FileKindsService} from '../core/services/file-kinds.service';
import {ModalNamingComponent} from './modal-naming/modal-naming.component';
import {ModalNamingDeletionComponent} from './modal-naming-deletion/modal-naming-deletion.component';

@Component({
  selector: 'app-manage-naming',
  templateUrl: './manage-naming.component.html',
  styleUrls: ['./manage-naming.component.scss']
})
export class ManageNamingComponent implements OnInit {

  table: Table;
  applicationSelected: Application;
  private idActionModify = 'actionModify';
  private idActionDelete = 'actionDelete';

  constructor(private fileKindsService: FileKindsService,
              private modalService: NgbModal,
              private notifierService: NotifierService) {
  }

  ngOnInit() {
  }

  applicationChanged(application: Application) {
    this.showNaming();
    this.applicationSelected = application;
    this.fileKindsService.getAllFromApplication(application.id).subscribe(
      fileKinds => {
        this.table.items = fileKinds;
      }
    );
  }

  showNaming() {
    this.table = new Table();
    this.table.showHeader = false;
    this.table.showFooter = false;

    this.table.settings.globalAction = new Action('Ajouter un nommage', '');

    this.table.settings.columnsDefinition.id = new ColumnsDefinition();
    this.table.settings.columnsDefinition.id.title = 'Id';
    this.table.settings.columnsDefinition.id.order = 1;
    this.table.settings.columnsDefinition.name = new ColumnsDefinition();
    this.table.settings.columnsDefinition.name.title = 'Nom';
    this.table.settings.columnsDefinition.name.order = 2;
    this.table.settings.columnsDefinition.pattern = new ColumnsDefinition();
    this.table.settings.columnsDefinition.pattern.title = 'Pattern';
    this.table.settings.columnsDefinition.pattern.order = 3;

    this.table.settings.actionsDefinition.title = 'Action';
    this.table.settings.actionsDefinition.actions.push(new Action('Modifier', this.idActionModify));
    this.table.settings.actionsDefinition.actions.push(new Action('Supprimer', this.idActionDelete));
  }

  onClickAddNaming() {
    const modalRef = this.modalService.open(ModalNamingComponent);
    modalRef.result.then((result) => {
      this.notifierService.notify('success', `Le nommage ${result.name} a bien été ajouté`);
      this.applicationChanged(this.applicationSelected);
    }, (reason) => {
      if (reason.message !== undefined) {
        this.notifierService.notify('error', `Une erreur est survenue lors de l'ahout du nommage : ${reason.message}`);
      }
    });
    modalRef.componentInstance.application = this.applicationSelected;
    modalRef.componentInstance.isUpdate = false;
  }

  onActionClicked(event: ActionClickEvent) {
    if (event.id === this.idActionModify) {
      const modalRef = this.modalService.open(ModalNamingComponent);
      modalRef.result.then((result) => {
        this.notifierService.notify('success', `Le nommage ${result.name} a bien été modifié`);
        this.applicationChanged(this.applicationSelected);
      }, (reason) => {
        if (reason.message !== undefined) {
          this.notifierService.notify('error', `Une erreur est survenue lors de la modification du nommage : ${reason.message}`);
        }
      });
      modalRef.componentInstance.application = this.applicationSelected;
      modalRef.componentInstance.fileKind = event.item;
      modalRef.componentInstance.isUpdate = true;
    }

    if (event.id === this.idActionDelete) {
      const modalRef = this.modalService.open(ModalNamingDeletionComponent);
      modalRef.result.then((result) => {
        event.item.environnements = [];
        this.fileKindsService.deleteNaming(event.item).subscribe(
          fileKind => {
            this.notifierService.notify('success', `Le nommage a été supprimé`);
            this.applicationChanged(this.applicationSelected);
          },
          reason => {
            this.notifierService.notify('error', `Une erreur est survenue lors de la suppression du nommage : ${reason}`);
          }
        );
      }, reason => {
      });
      modalRef.componentInstance.application = this.applicationSelected;
      modalRef.componentInstance.fileKind = event.item;
      modalRef.componentInstance.isUpdate = true;
    }
  }

}
