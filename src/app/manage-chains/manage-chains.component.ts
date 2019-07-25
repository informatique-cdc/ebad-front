import { Component, OnInit } from '@angular/core';
import {Action, ColumnsDefinition, Table} from '../shared/table/table.model';
import {Environment} from '../core/models';
import {ChainsService} from '../core/services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotifierService} from 'angular-notifier';
import {ModalChainComponent} from './modal-chain/modal-chain.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ActionClickEvent} from '../shared/table/action-click-event.model';
import {ModalBatchComponent} from '../manage-batchs/modal-batch/modal-batch.component';
import {ModalBatchDeletionComponent} from '../manage-batchs/modal-batch-deletion/modal-batch-deletion.component';
import {ModalChainDeletionComponent} from './modal-chain-deletion/modal-chain-deletion.component';

@Component({
  selector: 'app-manage-chains',
  templateUrl: './manage-chains.component.html',
  styleUrls: ['./manage-chains.component.scss']
})
export class ManageChainsComponent implements OnInit {

  table: Table;
  environmentSelected: Environment;
  private idActionModify = 'actionModify';
  private idActionDelete = 'actionDelete';

  constructor(private chainsService: ChainsService,
              private modalService: NgbModal,
              private notifierService: NotifierService) {
  }

  ngOnInit() {
  }

  environmentChanged(environment: Environment) {
    this.showChains();
    this.environmentSelected = environment;
    this.chainsService.getAllFromEnvironment(environment.id).subscribe(
      chains => {
        this.table.items = chains;
      }
    );
  }

  showChains() {
    this.table = new Table();
    this.table.showHeader = false;
    this.table.showFooter = false;

    this.table.settings.globalAction = new Action('Créer une chaine', '');

    this.table.settings.columnsDefinition.id = new ColumnsDefinition();
    this.table.settings.columnsDefinition.id.title = 'Id';
    this.table.settings.columnsDefinition.id.order = 1;
    this.table.settings.columnsDefinition.name = new ColumnsDefinition();
    this.table.settings.columnsDefinition.name.title = 'Nom';
    this.table.settings.columnsDefinition.name.order = 2;
    this.table.settings.columnsDefinition.description = new ColumnsDefinition();
    this.table.settings.columnsDefinition.description.title = 'Description';
    this.table.settings.columnsDefinition.description.order = 3;

    this.table.settings.actionsDefinition.title = 'Action';
    this.table.settings.actionsDefinition.actions.push(new Action('Modifier', this.idActionModify));
    this.table.settings.actionsDefinition.actions.push(new Action('Supprimer', this.idActionDelete));
  }

  onClickAddChain() {
    const modalRef = this.modalService.open(ModalChainComponent);
    modalRef.result.then((result) => {
      this.notifierService.notify('success', `La chaine ${result.name} a bien été ajoutée`);
      this.environmentChanged(this.environmentSelected);
    }, (reason) => {
      if (reason.message !== undefined) {
        this.notifierService.notify('error', `Une erreur est survenue lors de l'ajout de la chaine : ${reason.message}`);
      }
    });
    modalRef.componentInstance.environment = this.environmentSelected;
    modalRef.componentInstance.isUpdate = false;
  }

  onActionClicked(event: ActionClickEvent) {
    if (event.id === this.idActionModify) {
      const modalRef = this.modalService.open(ModalChainComponent);
      modalRef.result.then((result) => {
        this.notifierService.notify('success', `La chaine ${result.name} a bien été modifiée`);
        this.environmentChanged(this.environmentSelected);
      }, (reason) => {
        if (reason.message !== undefined) {
          this.notifierService.notify('error', `Une erreur est survenue lors de la modification de la chaine : ${reason.message}`);
        }
      });
      modalRef.componentInstance.environment = this.environmentSelected;
      modalRef.componentInstance.chain = event.item;
      modalRef.componentInstance.isUpdate = true;
    }

    if (event.id === this.idActionDelete) {
      const modalRef = this.modalService.open(ModalChainDeletionComponent);
      modalRef.result.then((result) => {
        event.item.environnements = [];
        this.chainsService.deleteChaine(event.item).subscribe(
          () => {
            this.notifierService.notify('success', `Le chaine a été supprimée`);
            this.environmentChanged(this.environmentSelected);
          },
          reason => {
            this.notifierService.notify('error', `Une erreur est survenue lors de la suppression de la chaine : ${reason}`);
          }
        );
      }, reason => {});
      modalRef.componentInstance.chain = event.item;
    }
  }
}
