import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Directory, Environment, FilesService} from '../core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalDirectoryComponent} from './modal-directory/modal-directory.component';
import {ModalDirectoryDeletionComponent} from './modal-directory-deletion/modal-directory-deletion.component';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {Constants} from '../shared/Constants';
import {ToastService} from '../core/services/toast.service';
import {TranslateService} from "@ngx-translate/core";
import LanguageSettings = DataTables.LanguageSettings;

@Component({
  selector: 'app-manage-directories',
  templateUrl: './manage-directories.component.html'
})
export class ManageDirectoriesComponent implements AfterViewInit, OnDestroy, OnInit {
  environmentSelected: Environment;
  directories: Directory[];

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  columns = [];

  constructor(private filesService: FilesService,
              private modalService: NgbModal,
              private toastService: ToastService,
              private constants: Constants,
              private translateService: TranslateService) {
    this.columns.push({data: 'id', name: 'id', visible: true});
    this.columns.push({data: 'name', name: 'nom', visible: true});
    this.columns.push({data: 'path', name: 'chemin relatif', visible: true});
    this.columns.push({data: 'canWrite', name: 'droit d\'écriture', visible: true});
    this.columns.push({data: 'canExplore', name: 'droit d\'explorer', visible: true});
    this.columns.push({data: '', name: 'actions', visible: true, orderable: false});
  }

  ngOnInit() {

    this.dtOptions = {
      language: this.constants.datatable[this.translateService.currentLang] as LanguageSettings,
      stateSave: true,
            stateSaveParams: function (settings, data: any) {
              data.search.search = "";
            },
      order: [[0, 'asc']],
      pagingType: 'full_numbers',
      pageLength: this.constants.numberByPage,
      serverSide: true,
      processing: false,
      ajax: (dataTablesParameters: any, callback) => {
        if (!this.environmentSelected) {
          this.directories = [];
          return;
        }
        this.filesService
          .getAllFromEnvironment(this.environmentSelected.id, {
              page: dataTablesParameters.start / dataTablesParameters.length,
              size: dataTablesParameters.length,
              sort: dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
              name: dataTablesParameters.search.value
            }
          )
          .subscribe(resp => {
            this.directories = resp.content;
            callback({
              recordsTotal: resp.totalElements,
              recordsFiltered: resp.totalElements,
              data: []
            });
          });
      },
      columns: this.columns
    };
    this.dtTrigger.next();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  refreshDirectories() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  environmentChanged(environment: Environment) {
    this.environmentSelected = environment;
    this.refreshDirectories();
  }

  onClickAddDirectory() {
    const modalRef = this.modalService.open(ModalDirectoryComponent);
    modalRef.result.then((result) => {
      this.toastService.showSuccess(`Le répertoire ${result.name} a bien été ajouté`);
      this.environmentChanged(this.environmentSelected);
    }, (reason) => {
      if (reason.apierror.message !== undefined) {
        this.toastService.showError( `Une erreur est survenue lors de l'ajout du répertoire : ${reason.apierror.message}`);
      }
    });
    modalRef.componentInstance.environment = this.environmentSelected;
    modalRef.componentInstance.isUpdate = false;
  }

  editDirectory(directory: Directory) {
    const modalRef = this.modalService.open(ModalDirectoryComponent);
    modalRef.result.then((result) => {
      this.toastService.showSuccess(`Le répertoire ${result.name} a bien été modifié`);
      this.environmentChanged(this.environmentSelected);
    }, (reason) => {
      if (reason.apierror.message !== undefined) {
        this.toastService.showError( `Une erreur est survenue lors de la modification du répertoire : ${reason.apierror.message}`);
      }
    });
    modalRef.componentInstance.environment = this.environmentSelected;
    modalRef.componentInstance.directory = {...directory};
    modalRef.componentInstance.isUpdate = true;
  }

  deleteDirectory(directory: Directory) {
    const modalRef = this.modalService.open(ModalDirectoryDeletionComponent);
    modalRef.result.then(() => {
      this.filesService.deleteDirectory(directory).subscribe(
        () => {
          this.toastService.showSuccess(`Le répertoire a été supprimé`);
          this.environmentChanged(this.environmentSelected);
        },
        reason => {
          this.toastService.showError( `Une erreur est survenue lors de la suppression du répertoire : ${reason}`);
        }
      );
    });
    modalRef.componentInstance.directory = directory;
  }

  onResizeTable(event){
    if(event.oldWidth == undefined || event.newWidth === event.oldWidth){
      return;
    }
    this.refreshDirectories();
  }
}
