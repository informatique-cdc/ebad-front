import {Component, OnInit} from '@angular/core';
import {Action, ColumnsDefinition, Table} from '../shared/table/table.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotifierService} from 'angular-notifier';
import {NewsService} from '../core/services';
import {ActionClickEvent} from '../shared/table/action-click-event.model';
import {ModalNewComponent} from './modal-new/modal-new.component';
import {ModalNewDeletionComponent} from './modal-new-deletion/modal-new-deletion.component';

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.scss']
})
export class AdminNewsComponent implements OnInit {

  table: Table;

  private idActionModify = 'actionModify';
  private idActionDelete = 'actionDelete';

  constructor(private modalService: NgbModal,
              private notifierService: NotifierService,
              private newsService: NewsService) {
  }

  ngOnInit() {
    this.showNews();
  }

  showNews() {
    this.table = new Table();
    this.table.showHeader = false;
    this.table.showFooter = false;

    this.table.settings.globalAction = new Action('Ajouter une actualité', '');

    this.table.settings.columnsDefinition.id = new ColumnsDefinition();
    this.table.settings.columnsDefinition.id.title = 'ID';
    this.table.settings.columnsDefinition.id.order = 1;
    this.table.settings.columnsDefinition.title = new ColumnsDefinition();
    this.table.settings.columnsDefinition.title.title = 'Titre';
    this.table.settings.columnsDefinition.title.order = 2;
    this.table.settings.columnsDefinition.draft = new ColumnsDefinition();
    this.table.settings.columnsDefinition.draft.title = 'Brouillon';
    this.table.settings.columnsDefinition.draft.order = 3;

    this.table.settings.actionsDefinition.title = 'Action';
    this.table.settings.actionsDefinition.actions.push(new Action('Modifier', this.idActionModify));
    this.table.settings.actionsDefinition.actions.push(new Action('Supprimer', this.idActionDelete));

    this.refreshNorms();
  }

  refreshNorms() {
    this.newsService.getAll().subscribe(
      (norms) => {
        this.table.items = norms;
      }
    );
  }

  onClickAddNew() {
    const modalRef = this.modalService.open(ModalNewComponent, {size: 'lg'});
    modalRef.result.then(() => {
      this.notifierService.notify('success', `L'actualité a bien été ajoutée`);
      this.refreshNorms();
    }, (reason) => {
      if (reason.message !== undefined) {
        this.notifierService.notify('error', `Une erreur est survenue lors de l'ajout de l'actualité : ${reason.message}`);
      }
    });
    modalRef.componentInstance.isUpdate = false;
  }

  onActionClicked(event: ActionClickEvent) {
    if (event.id === this.idActionModify) {
      const modalRef = this.modalService.open(ModalNewComponent, {size: 'lg'});
      modalRef.result.then((result) => {
        this.notifierService.notify('success', `L'actualité a bien été modifiée`);
        this.refreshNorms();
      }, (reason) => {
        if (reason.message !== undefined) {
          this.notifierService.notify('error', `Une erreur est survenue lors de la modification de l'actualité : ${reason.message}`);
        }
      });
      modalRef.componentInstance.oneNew = event.item;
      modalRef.componentInstance.isUpdate = true;
    }

    if (event.id === this.idActionDelete) {
      const modalRef = this.modalService.open(ModalNewDeletionComponent);
      modalRef.result.then((result) => {
        this.newsService.deleteNew(event.item.id).subscribe(
          () => {
            this.notifierService.notify('success', `L'actualité a été supprimée`);
            this.refreshNorms();
          },
          reason => {
            this.notifierService.notify('error', `Une erreur est survenue lors de la suppression de l'actualité : ${reason}`);
          }
        );
      }, reason => {
      });
      modalRef.componentInstance.oneNew = event.item;
    }

  }

}
