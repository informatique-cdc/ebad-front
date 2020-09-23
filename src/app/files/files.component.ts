import {Component, OnInit} from '@angular/core';
import {FileSystemDirectoryEntry, FileSystemFileEntry} from 'ngx-file-drop';
import {EventSelectChangeModel, Option, Select} from '../shared/head-selector';
import {Application, Directory, Environment, File} from '../core/models';
import {ApplicationsService, EnvironmentsService, FilesService} from '../core/services';
import * as FileSaver from 'file-saver';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalRenameComponent} from './modal-rename/modal-rename.component';
import {Pageable} from "../core/models/pageable.model";
import {ToastService} from "../core/services/toast.service";

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html'
})
export class FilesComponent implements OnInit {
  private idSelectApplication = 'selectApplication';
  private idSelectEnvironnement = 'selectEnvironnement';
  private idSelectDirectory = 'selectDirectory';


  selectHead: Select[] = [];
  private applications: Application[] = [];
  title = 'Fichiers';
  localFiles: any[] = [];
  remoteFiles: File[];


  directorySelected: Directory = null;
  applicationSelected: Application = null;

  constructor(private applicationsService: ApplicationsService,
              private filesService: FilesService,
              private toastService: ToastService,
              private environmentsService: EnvironmentsService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.applicationsService.getAll(new Pageable(0, 100)).subscribe(
      applications => {
        this.applications = applications.content;
        this.constructSelect();
      }
    );
  }


  refreshRemoteFiles() {
    this.filesService.getAllFilesFromDirectory(this.directorySelected.id).subscribe((files) => this.remoteFiles=files);
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
      this.environmentsService.getEnvironmentFromApp(event.value.id, new Pageable(0, 100, 'name,asc'))
        .subscribe((page) => this.updateSelectEnvironment(page.content));
      this.title = `Fichiers - ${event.value.name}`;
      this.updateSelectDirectory(null);
    }

    if (event.idSelect === this.idSelectEnvironnement) {
      this.updateSelectDirectory(event.value);
    }

    if (event.idSelect === this.idSelectDirectory) {
      this.directorySelected = event.value;
      this.refreshRemoteFiles();
      if (this.directorySelected.canWrite) {
        // this.showLocalFile();
      }
    }
  }

  //// UPLOAD ////

  //FIXME UPLOAD EVENT
  public dropped(event: any) {
    console.log(event);
    for (const droppedFile of event) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file) => {

          const existFile = (this.localFiles as any[]).find(
            thisFile => thisFile.name === file.name && file.size === thisFile.size
          );

          if (!existFile) {
            (file as any).customName = file.name;
            this.localFiles.push(file);
          }

          // if (this.tableLocal.items.length > 0) {
          //   this.tableLocal.showFooter = true;
          // }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      }
    }
  }

  deleteLocalFile(file: File) {
    this.localFiles.splice(this.localFiles.indexOf(file), 1);
  }

  renameLocalFile(file: File) {
    const modalRef = this.modalService.open(ModalRenameComponent);
    modalRef.result.then((result) => {
      const indexItem = this.localFiles.indexOf(file);
      this.localFiles[indexItem].customName = result;
    }, (reason) => {
    });
    modalRef.componentInstance.file = file;
    modalRef.componentInstance.application = this.applicationSelected;

  }

  deleteRemoteFile(file: File) {
    this.filesService.deleteFile(file).subscribe(
      () => {
        this.remoteFiles.splice(this.remoteFiles.indexOf(file), 1);
        this.toastService.showSuccess('Le fichier ' + file.name + ' a été supprimé du serveur distant');
      }, error => {
        this.toastService.showError('Une erreur s\'est produite lors de la suppresion du fichier ' + file.name);
      }
    );
  }

  downloadRemoteFile(file: File) {
    this.filesService.downloadFile(file).subscribe(
      arrayBuffer => {
        const blob = new Blob([arrayBuffer], {type: 'application/octet-stream'});
        const url = window.URL.createObjectURL(blob);
        FileSaver.saveAs(blob, file.name);
      }
    );
  }

  upload() {

    for (const file of this.localFiles) {
      this.filesService.uploadFile(file, file.customName, this.directorySelected.id).subscribe(
        () => {
          this.localFiles.splice(this.localFiles.indexOf(file), 1);
          this.refreshRemoteFiles();
        },
        (error) => {
          this.toastService.showError('Une erreur est survenue lors de l\'envoi d\'un fichier sur le serveur distant');
        }
      );
    }

  }

  explore(): void{

  }
}
