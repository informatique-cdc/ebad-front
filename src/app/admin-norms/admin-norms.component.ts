import {Component, OnInit} from '@angular/core';
import {Action, ColumnsDefinition, Table} from '../shared/table/table.model';
import {NormsService} from '../core/services';
import {ActionClickEvent} from '../shared/table/action-click-event.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotifierService} from 'angular-notifier';
import {ModalNormComponent} from './modal-norm/modal-norm.component';
import {ModalNormDeletionComponent} from './modal-norm-deletion/modal-norm-deletion.component';
import {Constants} from "../shared/Constants";
import {Pageable} from "../core/models/pageable.model";

@Component({
  selector: 'app-admin-norms',
  templateUrl: './admin-norms.component.html',
  styleUrls: ['./admin-norms.component.scss']
})
export class AdminNormsComponent implements OnInit {

  table: Table;
  size = this.constants.numberByPage;
  page = 0;
  totalSize = 0;

  private idActionModify = 'actionModify';
  private idActionDelete = 'actionDelete';

  constructor(private modalService: NgbModal,
              private notifierService: NotifierService,
              private constants: Constants,
              private normsService: NormsService) {
  }

  ngOnInit() {
    this.showNorms();
  }

  showNorms() {
    this.table = new Table();
    this.table.showHeader = false;
    this.table.showFooter = true;

    this.table.settings.globalAction = new Action('Ajouter une norme', '');

    this.table.settings.columnsDefinition.id = new ColumnsDefinition();
    this.table.settings.columnsDefinition.id.title = 'ID';
    this.table.settings.columnsDefinition.id.order = 1;
    this.table.settings.columnsDefinition.name = new ColumnsDefinition();
    this.table.settings.columnsDefinition.name.title = 'Nom';
    this.table.settings.columnsDefinition.name.order = 2;
    this.table.settings.columnsDefinition.commandLine = new ColumnsDefinition();
    this.table.settings.columnsDefinition.commandLine.title = 'Interpréteur';
    this.table.settings.columnsDefinition.commandLine.order = 3;
    this.table.settings.columnsDefinition.pathShell = new ColumnsDefinition();
    this.table.settings.columnsDefinition.pathShell.title = 'Dossier shell';
    this.table.settings.columnsDefinition.pathShell.order = 4;
    this.table.settings.columnsDefinition.ctrlMDate = new ColumnsDefinition();
    this.table.settings.columnsDefinition.ctrlMDate.title = 'Fichier date';
    this.table.settings.columnsDefinition.ctrlMDate.order = 5;

    this.table.settings.actionsDefinition.title = 'Action';
    this.table.settings.actionsDefinition.actions.push(new Action('Modifier', this.idActionModify));
    this.table.settings.actionsDefinition.actions.push(new Action('Supprimer', this.idActionDelete));

    this.refreshNorms();
  }

  refreshNorms(pageable?: Pageable) {
    this.normsService.getAll(pageable).subscribe(
      (norms) => {
        this.table.items = norms.content;
        this.totalSize = norms.totalElements;
      }
    );
  }

  onClickAddNorm() {
    const modalRef = this.modalService.open(ModalNormComponent);
    modalRef.result.then((result) => {
      this.notifierService.notify('success', `La norme a bien été ajoutée`);
      this.refreshNorms();
    }, (reason) => {
      if (reason.message !== undefined) {
        this.notifierService.notify('error', `Une erreur est survenue lors de l'ajout de la norme : ${reason.message}`);
      }
    });
    modalRef.componentInstance.isUpdate = false;
  }

  onActionClicked(event: ActionClickEvent) {
    if (event.id === this.idActionModify) {
      const modalRef = this.modalService.open(ModalNormComponent);
      modalRef.result.then((result) => {
        this.notifierService.notify('success', `La norme a bien été modifiée`);
        this.refreshNorms();
      }, (reason) => {
        if (reason.message !== undefined) {
          this.notifierService.notify('error', `Une erreur est survenue lors de la modification de la norme : ${reason.message}`);
        }
      });
      modalRef.componentInstance.norm = event.item;
      modalRef.componentInstance.isUpdate = true;
    }

    if (event.id === this.idActionDelete) {
      const modalRef = this.modalService.open(ModalNormDeletionComponent);
      modalRef.result.then((result) => {
        this.normsService.deleteNorm(event.item.id).subscribe(
          () => {
            this.notifierService.notify('success', `La norme a été supprimée`);
            this.refreshNorms();
          },
          reason => {
            this.notifierService.notify('error', `Une erreur est survenue lors de la suppression de la norme : ${reason.detail}`);
          }
        );
      }, reason => {
      });
      modalRef.componentInstance.norm = event.item;
    }

  }

  onPageChange(event) {
    this.refreshNorms(new Pageable(this.page-1, this.size))
  }
}
