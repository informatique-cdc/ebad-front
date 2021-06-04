import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FileSystemDirectoryEntry, FileSystemFileEntry} from 'ngx-file-drop';
import {EventSelectChangeModel, Option, Select} from '../shared';
import {
  ApplicationsService,
  EnvironmentsService,
  FilesService,
  Application,
  Directory,
  Environment,
  File
} from '../core';
import * as FileSaver from 'file-saver';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalRenameComponent} from './modal-rename/modal-rename.component';
import {Pageable} from '../core/models/pageable.model';
import {ToastService} from '../core/services/toast.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import LanguageSettings = DataTables.LanguageSettings;
import {Constants} from '../shared/Constants';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html'
})
export class FilesComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective, {static: true})
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  columns = [];

  private idSelectApplication = 'selectApplication';
  private idSelectEnvironnement = 'selectEnvironnement';
  private idSelectDirectory = 'selectDirectory';


  selectHead: Select[] = [];
  private applications: Application[] = [];
  title = 'Fichiers';
  localFiles: any[] = [];
  remoteFiles: File[];
  subDir: string[] = [];


  directorySelected: Directory = null;
  applicationSelected: Application = null;

  constructor(private applicationsService: ApplicationsService,
              private filesService: FilesService,
              private toastService: ToastService,
              private environmentsService: EnvironmentsService,
              private translateService: TranslateService,
              private constants: Constants,
              private modalService: NgbModal) {
    this.columns.push({data: 'name', name: 'nom', visible: true});
    this.columns.push({data: 'size', name: 'size', visible: true});
    this.columns.push({data: 'createDate', name: 'createDate', visible: true, orderable: true});
    this.columns.push({data: '', name: 'actions', visible: true, orderable: false});
  }

  ngOnInit() {
    this.applicationsService.getAll(new Pageable(0, 100)).subscribe(
      applications => {
        this.applications = applications.content;
        this.constructSelect();
      }
    );

    this.dtOptions = {
      language: this.constants.datatable[this.translateService.currentLang] as LanguageSettings,
      stateSave: false,
      order: [[0, 'asc']],
      pagingType: 'full_numbers',
      pageLength: this.constants.numberByPage,
      serverSide: false,
      processing: true,
      data: this.remoteFiles,
      columns: this.columns,
      ajax: (dataTablesParameters: any, callback) => {
        let subDirectoryParam = '';
        this.subDir.forEach(dir => {
          subDirectoryParam += '/' + dir;
        });
        this.remoteFiles = [];

        if (!this.directorySelected) {
          this.remoteFiles = [];
          return;
        }
        this.filesService.getAllFilesFromDirectory(this.directorySelected.id, subDirectoryParam)
          .subscribe((files) => {
              this.remoteFiles = files;
              callback({
                recordsTotal: files.length,
                recordsFiltered: files.length,
                data: []
              });
            }, error =>
              this.toastService.showError(error || 'Une erreur est survenue')
          );
      },
    };
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  refreshRemoteFiles() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
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
      // if (this.directorySelected.canWrite) {
      // this.showLocalFile();
      // }
    }
  }

  //// UPLOAD ////

  // FIXME UPLOAD EVENT
  public dropped(event: any) {
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
        this.dtTrigger.next();
      }, error => {
        this.toastService.showError('Une erreur s\'est produite lors de la suppresion du fichier ' + file.name);
      }
    );
  }

  downloadRemoteFile(file: File) {
    console.log("downloadRemoteFile");
    this.filesService.downloadFile(file).subscribe(
      arrayBuffer => {
        const blob = new Blob([arrayBuffer], {type: 'application/octet-stream'});
        const url = window.URL.createObjectURL(blob);
        FileSaver.saveAs(blob, file.name);
      }
    );
  }

  upload() {
    let subDirectoryParam = '';
    this.subDir.forEach(dir => {
      subDirectoryParam += '/' + dir;
    });
    for (const file of this.localFiles) {
      this.filesService.uploadFile(file, file.customName, this.directorySelected.id, subDirectoryParam).subscribe(
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

  exploreParentDirectory(): void {
    this.subDir.pop();
    this.explore();
  }

  exploreChildDirectory(remoteDir: File): void {
    this.subDir.push(remoteDir.name);
    this.explore();
  }

  explore(): void {
    let subDirectoryParam = '';
    this.subDir.forEach(dir => {
      subDirectoryParam += '/' + dir;
    });
    this.filesService.getAllFilesFromDirectory(this.directorySelected.id, subDirectoryParam).subscribe((files) => this.remoteFiles = files);
    this.refreshRemoteFiles();
  }
}
