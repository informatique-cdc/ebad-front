import {Component, OnInit} from '@angular/core';
import {Action, ColumnsDefinition, Table} from '../shared/table/table.model';
import {Directory, Environment} from '../core/models';
import {ActionClickEvent} from '../shared/table/action-click-event.model';
import {FilesService} from '../core/services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotifierService} from 'angular-notifier';
import {ModalDirectoryComponent} from './modal-directory/modal-directory.component';
import {ModalDirectoryDeletionComponent} from './modal-directory-deletion/modal-directory-deletion.component';

@Component({
  selector: 'app-manage-directories',
  templateUrl: './manage-directories.component.html',
  styleUrls: ['./manage-directories.component.scss']
})
export class ManageDirectoriesComponent implements OnInit {
  table: Table;
  environmentSelected: Environment;
  private idActionModify = 'actionModify';
  private idActionDelete = 'actionDelete';

  constructor(private filesService: FilesService,
              private modalService: NgbModal,
              private notifierService: NotifierService) {
  }

  ngOnInit() {
  }

  environmentChanged(environment: Environment) {
    this.showDirectories();
    this.environmentSelected = environment;
    this.filesService.getAllFromEnvironment(environment.id).subscribe(
      directories => {
        this.table.items = directories;
        for (const file of this.table.items) {
          file.right = 'Lecture seule';
          if ((file as Directory).canWrite) {
            file.right = 'Lecture / Ecriture';
          }
        }
      }
    );
  }

  showDirectories() {
    this.table = new Table();
    this.table.showHeader = false;
    this.table.showFooter = false;

    this.table.settings.globalAction = new Action('Ajouter un répertoire', '');

    this.table.settings.columnsDefinition.id = new ColumnsDefinition();
    this.table.settings.columnsDefinition.id.title = 'Id';
    this.table.settings.columnsDefinition.id.order = 1;
    this.table.settings.columnsDefinition.name = new ColumnsDefinition();
    this.table.settings.columnsDefinition.name.title = 'Nom';
    this.table.settings.columnsDefinition.name.order = 2;
    this.table.settings.columnsDefinition.path = new ColumnsDefinition();
    this.table.settings.columnsDefinition.path.title = 'Chemin relatif';
    this.table.settings.columnsDefinition.path.order = 3;
    this.table.settings.columnsDefinition.right = new ColumnsDefinition();
    this.table.settings.columnsDefinition.right.title = 'Droits';
    this.table.settings.columnsDefinition.right.order = 4;

    this.table.settings.actionsDefinition.title = 'Action';
    this.table.settings.actionsDefinition.actions.push(new Action('Modifier', this.idActionModify));
    this.table.settings.actionsDefinition.actions.push(new Action('Supprimer', this.idActionDelete));
  }

  onClickAddDirectory() {
    const modalRef = this.modalService.open(ModalDirectoryComponent);
    modalRef.result.then((result) => {
      this.notifierService.notify('success', `Le répertoire ${result.name} a bien été ajouté`);
      this.environmentChanged(this.environmentSelected);
    }, (reason) => {
      if (reason.message !== undefined) {
        this.notifierService.notify('error', `Une erreur est survenue lors de l'ajout du répertoire : ${reason.message}`);
      }
    });
    modalRef.componentInstance.environment = this.environmentSelected;
    modalRef.componentInstance.isUpdate = false;
  }

  onActionClicked(event: ActionClickEvent) {
    if (event.id === this.idActionModify) {
      const modalRef = this.modalService.open(ModalDirectoryComponent);
      modalRef.result.then((result) => {
        this.notifierService.notify('success', `Le répertoire ${result.name} a bien été modifié`);
        this.environmentChanged(this.environmentSelected);
      }, (reason) => {
        if (reason.message !== undefined) {
          this.notifierService.notify('error', `Une erreur est survenue lors de la modification du répertoire : ${reason.message}`);
        }
      });
      modalRef.componentInstance.environment = this.environmentSelected;
      modalRef.componentInstance.directory = event.item;
      modalRef.componentInstance.isUpdate = true;
    }

    if (event.id === this.idActionDelete) {
      const modalRef = this.modalService.open(ModalDirectoryDeletionComponent);
      modalRef.result.then((result) => {
        event.item.environnements = [];
        this.filesService.deleteDirectory(event.item).subscribe(
          () => {
            this.notifierService.notify('success', `Le répertoire a été supprimé`);
            this.environmentChanged(this.environmentSelected);
          },
          reason => {
            this.notifierService.notify('error', `Une erreur est survenue lors de la suppression du répertoire : ${reason}`);
          }
        );
      }, reason => {});
      modalRef.componentInstance.directory = event.item;
    }
  }
}
