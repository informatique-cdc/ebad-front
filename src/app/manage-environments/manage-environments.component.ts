import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Application, Environment} from '../core/models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApplicationsService, EnvironmentsService, GlobalSettingsService} from '../core/services';
import {ModalEnvironmentComponent} from './modal-environment/modal-environment.component';
import {ModalEnvironmentDeletionComponent} from './modal-environment-deletion/modal-environment-deletion.component';
import {Constants} from "../shared/Constants";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {ToastService} from "../core/services/toast.service";

@Component({
  selector: 'app-manage-environments',
  templateUrl: './manage-environments.component.html'
})
export class ManageEnvironmentsComponent implements AfterViewInit, OnDestroy, OnInit {
  applicationSelected: Application;
  addEnvironmentEnabled = true;
  importEnvironmentEnabled = true;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  environments: Environment[] = [];

  constructor(private environmentsService: EnvironmentsService,
              private modalService: NgbModal,
              private applicationsService: ApplicationsService,
              private constants: Constants,
              private toastService: ToastService,
              private globalSettingsService: GlobalSettingsService) {
  }


  applicationChanged(application: Application) {
    this.refreshEnvironments();
    this.applicationSelected = application;
    this.applicationsService.getAllModerable().subscribe(
      apps => {
        for (const app of apps.content) {
          if (app.id === this.applicationSelected.id) {
            this.refreshEnvironments();
          }
        }
      }
    );
  }

  ngOnInit() {
    this.addEnvironmentEnabled = this.globalSettingsService.createEnvironmentIsEnable();
    this.importEnvironmentEnabled = this.globalSettingsService.importEnvironmentIsEnable();

    this.dtOptions = {
      order: [[0,'asc']],
      pagingType: 'full_numbers',
      pageLength: this.constants.numberByPage,
      serverSide: true,
      processing: false,
      ajax: (dataTablesParameters: any, callback) => {
        if(!this.applicationSelected){
          this.environments = [];
          return
        }
        this.environmentsService
          .getEnvironmentFromApp(this.applicationSelected.id, {
              'page': dataTablesParameters.start / dataTablesParameters.length,
              'size': dataTablesParameters.length,
              'sort': dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
              'name': dataTablesParameters.search.value
            }
          )
          .subscribe(resp => {
            this.environments = resp.content;
            callback({
              recordsTotal: resp.totalElements,
              recordsFiltered: resp.totalElements,
              data: []
            });
          });
      },
      columns: [{
        data: 'id'
      }, {data: 'name'}, {data: 'host'}, {data: 'login'}, {data: 'homePath'}, {data: 'prefix'}, {
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

  refreshEnvironments() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }


  onClickAddEnvironment() {
    const modalRef = this.modalService.open(ModalEnvironmentComponent);
    modalRef.result.then((result) => {
      this.toastService.showSuccess(`L'environnement ${result.name} a bien été ajouté`);
      this.applicationChanged(this.applicationSelected);
    }, (reason) => {
      if (reason.message !== undefined) {
        this.toastService.showError( `Une erreur est survenue lors de l'ahout de l'environnement : ${reason.message}`);
      }
    });
    modalRef.componentInstance.application = this.applicationSelected;
    modalRef.componentInstance.isUpdate = false;
  }

  onClickImportEnvironments() {
    this.environmentsService.importEnvironmentToApp(this.applicationSelected.id).subscribe(
      (result) => {
        this.toastService.showSuccess(`Les environnements ont bien étaient importés`);
        this.refreshEnvironments();
      },
      (error) => this.toastService.showError(`Une erreur est survenue lors de l'import des environnments : ${error.message}`)
    )
  }

  editEnvironment(env: Environment) {
    const modalRef = this.modalService.open(ModalEnvironmentComponent);
    modalRef.result.then((result) => {
      this.toastService.showSuccess(`L'environnement ${result.name} a bien été modifié`);
      this.applicationChanged(this.applicationSelected);
    }, (reason) => {
      if (reason.message !== undefined) {
        this.toastService.showError( `Une erreur est survenue lors de la modification de l'environnement : ${reason.message}`);
      }
    });
    modalRef.componentInstance.application = this.applicationSelected;
    modalRef.componentInstance.environment = env;
    modalRef.componentInstance.isUpdate = true;
  }

  deleteEnvironment(env: Environment) {
    const modalRef = this.modalService.open(ModalEnvironmentDeletionComponent);
    modalRef.result.then((result) => {
      this.environmentsService.deleteEnvironemnt(env.id).subscribe(
        fileKind => {
          this.toastService.showSuccess(`L'environnement a été supprimé`);
          this.applicationChanged(this.applicationSelected);
        },
        reason => {
          this.toastService.showError( `Une erreur est survenue lors de la suppression de l'environnement : ${reason}`);
        }
      );
    }, reason => {
    });
    modalRef.componentInstance.application = this.applicationSelected;
    modalRef.componentInstance.environment = env;
    modalRef.componentInstance.isUpdate = true;
  }

}
