import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Directory, Environment} from '../core/models';
import {FilesService} from '../core/services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalDirectoryComponent} from './modal-directory/modal-directory.component';
import {ModalDirectoryDeletionComponent} from './modal-directory-deletion/modal-directory-deletion.component';
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {Constants} from "../shared/Constants";
import {ToastService} from "../core/services/toast.service";

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

  constructor(private filesService: FilesService,
              private modalService: NgbModal,
              private toastService: ToastService,
              private constants: Constants) {
  }

  ngOnInit() {

    this.dtOptions = {
      order: [[0, 'asc']],
      pagingType: 'full_numbers',
      pageLength: this.constants.numberByPage,
      serverSide: true,
      processing: false,
      ajax: (dataTablesParameters: any, callback) => {
        if (!this.environmentSelected) {
          this.directories = [];
          return
        }
        this.filesService
          .getAllFromEnvironment(this.environmentSelected.id, {
              'page': dataTablesParameters.start / dataTablesParameters.length,
              'size': dataTablesParameters.length,
              'sort': dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
              'name': dataTablesParameters.search.value
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
      columns: [{
        data: 'id'
      }, {data: 'name'}, {data: 'path'}, {data: 'canWrite'},{data: 'canExplore'}, {
        data: '',
        orderable: false
      }]
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
      if (reason.message !== undefined) {
        this.toastService.showError( `Une erreur est survenue lors de l'ajout du répertoire : ${reason.message}`);
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
      if (reason.message !== undefined) {
        this.toastService.showError( `Une erreur est survenue lors de la modification du répertoire : ${reason.message}`);
      }
    });
    modalRef.componentInstance.environment = this.environmentSelected;
    modalRef.componentInstance.directory = directory;
    modalRef.componentInstance.isUpdate = true;
  }

  deleteDirectory(directory: Directory) {
    const modalRef = this.modalService.open(ModalDirectoryDeletionComponent);
    modalRef.result.then((result) => {
      this.filesService.deleteDirectory(directory).subscribe(
        () => {
          this.toastService.showSuccess(`Le répertoire a été supprimé`);
          this.environmentChanged(this.environmentSelected);
        },
        reason => {
          this.toastService.showError( `Une erreur est survenue lors de la suppression du répertoire : ${reason}`);
        }
      );
    }, reason => {
    });
    modalRef.componentInstance.directory = directory;
  }

}
