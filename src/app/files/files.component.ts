import {Component, OnInit} from '@angular/core';
import {FileSystemDirectoryEntry, FileSystemFileEntry, UploadEvent} from 'ngx-file-drop';
import {EventSelectChangeModel, Option, Select} from '../shared/head-selector';
import {Application, Directory, Environment} from '../core/models';
import {ApplicationsService, FilesService} from '../core/services';
import {Action, ColumnsDefinition, Table} from '../shared/table/table.model';
import {ActionClickEvent} from '../shared/table/action-click-event.model';
import {NotifierService} from 'angular-notifier';
import * as FileSaver from 'file-saver';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalRenameComponent} from './modal-rename/modal-rename.component';
import {Pageable} from "../core/models/pageable.model";

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
  private idSelectApplication = 'selectApplication';
  private idSelectEnvironnement = 'selectEnvironnement';
  private idSelectDirectory = 'selectDirectory';

  private idActionLocalDelete = 'actionLocalDelete';
  private idActionLocalRename = 'actionLocalRename';
  private idActionRemoteDelete = 'actionRemoteDelete';
  private idActionRemoteDownload = 'actionRemoteDownload';

  selectHead: Select[] = [];
  private applications: Application[] = [];
  title = 'Fichiers';
  tableRemote: Table;
  tableLocal: Table;

  directorySelected: Directory = null;
  applicationSelected: Application = null;

  constructor(private applicationsService: ApplicationsService,
              private filesService: FilesService,
              private notifierService: NotifierService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.applicationsService.getAll(new Pageable(0,100)).subscribe(
      applications => {
        this.applications = applications.content;
        this.constructSelect();
      }
    );
  }


  constructSelect() {
    const optionsApplication: Option[] = [];
    const optionsEnvironnement: Option[] = [];
    const optionsDirectory: Option[] = [];

    const selectApplication = new Select(this.idSelectApplication, optionsApplication);
    const selectEnvironnement = new Select(this.idSelectEnvironnement, optionsEnvironnement);
    const selectDirectory = new Select(this.idSelectDirectory, optionsDirectory);

    this.selectHead.push(selectApplication);
    this.selectHead.push(selectEnvironnement);
    this.selectHead.push(selectDirectory);

    optionsApplication.push(new Option('', 'Application', true));
    for (const app of this.applications) {
      optionsApplication.push(new Option(app, app.name, false));
    }

    optionsEnvironnement.push(new Option('', 'Environnements', true));
    optionsDirectory.push(new Option('', 'Répertoires', true));
  }

  updateSelectEnvironment(environnements: Environment[]) {

    const optionsEnvironnement: Option[] = [];
    optionsEnvironnement.push(new Option('', 'Environnements', true));

    for (const env of environnements) {
      optionsEnvironnement.push(new Option(env, env.name, false));
    }

    this.selectHead[1].options = optionsEnvironnement;
  }

  updateSelectDirectory(environment: Environment) {
    const optionsDirectory: Option[] = [];
    optionsDirectory.push(new Option('', 'Répertoires', true));

    if (environment != null) {
      this.filesService.getAllFromEnvironment(environment.id).subscribe(
        directories => {
          for (const directory of directories.content) {
            optionsDirectory.push(new Option(directory, directory.name, false));
          }
        }
      );
    }
    this.selectHead[2].options = optionsDirectory;
  }

  showChanged(event: EventSelectChangeModel) {
    this.directorySelected = null;

    if (event.idSelect === this.idSelectApplication) {
      this.applicationSelected = event.value;
      this.updateSelectEnvironment(event.value.environnements);
      this.title = `Fichiers - ${event.value.name}`;
      this.updateSelectDirectory(null);
    }

    if (event.idSelect === this.idSelectEnvironnement) {
      this.updateSelectDirectory(event.value);
    }

    if (event.idSelect === this.idSelectDirectory) {
      this.directorySelected = event.value;
      this.showRemoteFiles();
      if (this.directorySelected.canWrite) {
        this.showLocalFiles();
      }
    }
  }

  // SHOW FILE PART RIGHT
  showRemoteFiles() {
    this.tableRemote = new Table();
    this.tableRemote.showHeader = false;

    this.tableRemote.settings.columnsDefinition.name = new ColumnsDefinition();
    this.tableRemote.settings.columnsDefinition.name.title = 'Nom';
    this.tableRemote.settings.columnsDefinition.name.order = 1;

    this.tableRemote.settings.columnsDefinition.size = new ColumnsDefinition();
    this.tableRemote.settings.columnsDefinition.size.title = 'Taille';
    this.tableRemote.settings.columnsDefinition.size.order = 2;

    this.tableRemote.settings.actionsDefinition.title = 'Action';
    if (this.directorySelected.canWrite) {
      this.tableRemote.settings.actionsDefinition.actions.push(new Action('Supprimer', this.idActionRemoteDelete));
    }
    this.tableRemote.settings.actionsDefinition.actions.push(new Action('Télécharger', this.idActionRemoteDownload));
    this.filesService.getAllFilesFromDirectory(this.directorySelected.id).subscribe(
      files => {
        this.tableRemote.items = files;
      }
    );
  }

  showLocalFiles() {
    this.tableLocal = new Table();
    this.tableLocal.showHeader = false;
    this.tableLocal.showFooter = false;

    this.tableLocal.settings.columnsDefinition.customName = new ColumnsDefinition();
    this.tableLocal.settings.columnsDefinition.customName.title = 'Nom';
    this.tableLocal.settings.columnsDefinition.customName.order = 1;

    this.tableLocal.settings.columnsDefinition.size = new ColumnsDefinition();
    this.tableLocal.settings.columnsDefinition.size.title = 'Taille';
    this.tableLocal.settings.columnsDefinition.size.order = 2;

    this.tableLocal.settings.actionsDefinition.title = 'Action';
    this.tableLocal.settings.actionsDefinition.actions.push(new Action('Supprimer', this.idActionLocalDelete));
    this.tableLocal.settings.actionsDefinition.actions.push(new Action('Renommer', this.idActionLocalRename));
    this.tableLocal.items = [];
  }

  //// UPLOAD ////
  public dropped(event: UploadEvent) {
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          const existFile = (this.tableLocal.items as File[]).find(
            thisFile => thisFile.name === file.name && thisFile.size === thisFile.size
          );

          if (!existFile) {
            (file as any).customName = file.name;
            this.tableLocal.items.push(file);
          }

          if (this.tableLocal.items.length > 0) {
            this.tableLocal.showFooter = true;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }
    }
  }

  onActionClickedLocal(event: ActionClickEvent) {
    if (event.id === this.idActionLocalDelete) {
      this.tableLocal.items.splice(this.tableLocal.items.indexOf(event.item), 1);
    }

    if (event.id === this.idActionLocalRename) {
      const modalRef = this.modalService.open(ModalRenameComponent);
      modalRef.result.then((result) => {
        const indexItem = this.tableLocal.items.indexOf(event.item);
        this.tableLocal.items[indexItem].customName = result;
      }, (reason) => {
      });
      modalRef.componentInstance.file = event.item;
      modalRef.componentInstance.application = this.applicationSelected;
    }
  }

  onActionClickedRemote(event: ActionClickEvent) {
    if (event.id === this.idActionRemoteDelete) {
      this.filesService.deleteFile(event.item).subscribe(
        () => {
          this.tableRemote.items.splice(this.tableRemote.items.indexOf(event.item), 1);
          this.notifierService.notify('success', 'Le fichier ' + event.item.name + ' a été supprimé du serveur distant');
        }, error => {
          this.notifierService.notify('error', 'Une erreur s\'est produite lors de la suppresion du fichier ' + event.item.name);
        }
      );
    }

    if (event.id === this.idActionRemoteDownload) {
      this.filesService.downloadFile(event.item).subscribe(
        arrayBuffer => {
          const blob = new Blob([arrayBuffer], {type: 'application/octet-stream'});
          const url = window.URL.createObjectURL(blob);
          FileSaver.saveAs(blob, event.item.name);
        }
      );
    }
  }

  upload() {

    for (const file of this.tableLocal.items) {
      this.filesService.uploadFile(file, file.customName, this.directorySelected.id).subscribe(
        () => {
          this.filesService.getAllFilesFromDirectory(this.directorySelected.id).subscribe(
            files => {
              this.tableRemote.items = files;
              this.tableLocal.items.splice(this.tableLocal.items.indexOf(file), 1);
              if (this.tableLocal.items.length === 0) {
                this.tableLocal.showFooter = false;
              }
            }
          );
        },
        (error) => {
          this.notifierService.notify('error', 'Une erreur est survenue lors de l\'envoi d\'un fichier sur le serveur distant');
        }
      );
    }

  }
}
