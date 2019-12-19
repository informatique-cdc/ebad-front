import {Component, OnInit} from '@angular/core';
import {Application} from '../core/models';
import {BatchsService} from '../core/services';
import {Action, ColumnsDefinition, Table} from '../shared/table/table.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalBatchComponent} from './modal-batch/modal-batch.component';
import {ActionClickEvent} from '../shared/table/action-click-event.model';
import {NotifierService} from 'angular-notifier';
import {ModalBatchDeletionComponent} from './modal-batch-deletion/modal-batch-deletion.component';
import {Constants} from "../shared/Constants";
import {Pageable} from "../core/models/pageable.model";

@Component({
  selector: 'app-manage-batchs',
  templateUrl: './manage-batchs.component.html',
  styleUrls: ['./manage-batchs.component.scss']
})
export class ManageBatchsComponent implements OnInit {

  table: Table;
  applicationSelected: Application;

  size = this.constants.numberByPage;
  page = 0;
  totalSize = 0;

  private idActionModify = 'actionModify';
  private idActionDelete = 'actionDelete';

  constructor(private batchsService: BatchsService,
              private modalService: NgbModal,
              private constants: Constants,
              private notifierService: NotifierService) {
  }

  ngOnInit() {
  }

  applicationChanged(application: Application) {
    this.showBatch();
    this.applicationSelected = application;
    this.refreshBatchs();
  }


  refreshBatchs(pageable?: Pageable) {
    this.batchsService.getAllFromApplication(this.applicationSelected.id, pageable).subscribe(
      batchs => {
        this.table.items = batchs.content;
        this.totalSize = batchs.totalElements;

        for (const batch of this.table.items) {
          batch.env = '';
          for (const environnement of batch.environnements) {
            batch.env = `<span class="badge badge-primary">${environnement.name}</span>&nbsp${batch.env}`;
          }
        }
      }
    );
  }

  showBatch() {
    this.table = new Table();
    this.table.showHeader = false;
    this.table.showFooter = true;

    this.table.settings.globalAction = new Action('Ajouter un batch', '');

    this.table.settings.columnsDefinition.id = new ColumnsDefinition();
    this.table.settings.columnsDefinition.id.title = 'Id';
    this.table.settings.columnsDefinition.id.order = 1;
    this.table.settings.columnsDefinition.name = new ColumnsDefinition();
    this.table.settings.columnsDefinition.name.title = 'Nom';
    this.table.settings.columnsDefinition.name.order = 2;
    this.table.settings.columnsDefinition.path = new ColumnsDefinition();
    this.table.settings.columnsDefinition.path.title = 'Chemin du shell';
    this.table.settings.columnsDefinition.path.order = 3;
    this.table.settings.columnsDefinition.env = new ColumnsDefinition();
    this.table.settings.columnsDefinition.env.title = 'Environnements';
    this.table.settings.columnsDefinition.env.order = 4;

    this.table.settings.actionsDefinition.title = 'Action';
    this.table.settings.actionsDefinition.actions.push(new Action('Modifier', this.idActionModify));
    this.table.settings.actionsDefinition.actions.push(new Action('Supprimer', this.idActionDelete));
  }

  onClickAddBatch() {
    const modalRef = this.modalService.open(ModalBatchComponent);
    modalRef.result.then((result) => {
      this.notifierService.notify('success', `Le batch ${result.name} a bien été ajouté`);
      this.applicationChanged(this.applicationSelected);
    }, (reason) => {
      if (reason.message !== undefined) {
        this.notifierService.notify('error', `Une erreur est survenue lors de l'ahout du batch : ${reason.message}`);
      }
    });
    modalRef.componentInstance.application = this.applicationSelected;
    modalRef.componentInstance.isUpdate = false;
  }

  onActionClicked(event: ActionClickEvent) {
    if (event.id === this.idActionModify) {
      const modalRef = this.modalService.open(ModalBatchComponent);
      modalRef.result.then((result) => {
        this.notifierService.notify('success', `Le batch ${result.name} a bien été modifié`);
        this.applicationChanged(this.applicationSelected);
      }, (reason) => {
        if (reason.message !== undefined) {
          this.notifierService.notify('error', `Une erreur est survenue lors de la modification du batch : ${reason.message}`);
        }
      });
      modalRef.componentInstance.application = this.applicationSelected;
      modalRef.componentInstance.batch = event.item;
      modalRef.componentInstance.isUpdate = true;
    }

    if (event.id === this.idActionDelete) {
      const modalRef = this.modalService.open(ModalBatchDeletionComponent);
      modalRef.result.then((result) => {
        event.item.environnements = [];
        this.batchsService.updateBatch(event.item).subscribe(
          batch => {
            this.notifierService.notify('success', `Le batch ${batch.name} a été supprimé`);
            this.applicationChanged(this.applicationSelected);
          },
          reason => {
            this.notifierService.notify('error', `Une erreur est survenue lors de la suppression du batch : ${reason}`);
          }
        );
      }, reason => {});
      modalRef.componentInstance.application = this.applicationSelected;
      modalRef.componentInstance.batch = event.item;
      modalRef.componentInstance.isUpdate = true;
    }
  }

  onPageChange(event) {
    this.refreshBatchs(new Pageable(this.page-1, this.size))
  }
}
