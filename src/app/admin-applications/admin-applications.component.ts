import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApplicationsService, Application, GlobalSettingsService} from '../core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalApplicationComponent} from './modal-application/modal-application.component';
import {ModalUsersComponent} from './modal-users/modal-users.component';
import {ModalApplicationDeletionComponent} from './modal-application-deletion/modal-application-deletion.component';
import {Constants} from '../shared/Constants';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ToastService} from '../core/services/toast.service';
import {TranslateService} from '@ngx-translate/core';
import LanguageSettings = DataTables.LanguageSettings;

@Component({
  selector: 'app-admin-applications',
  templateUrl: './admin-applications.component.html',
  styleUrls: ['./admin-applications.component.scss']
})
export class AdminApplicationsComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective, {static: true})
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  applications: Application[] = [];

  addApplicationEnabled = true;
  importApplicationEnabled = true;
  columns = [];

  constructor(private modalService: NgbModal,
              private applicationsService: ApplicationsService,
              private constants: Constants,
              private toastService: ToastService,
              private globalSettingsService: GlobalSettingsService,
              private translateService: TranslateService) {
    this.columns.push({data: 'id', name: 'id', visible: true});
    this.columns.push({data: 'code', name: 'code', visible: true});
    this.columns.push({data: 'name', name: 'nom', visible: true});
    this.columns.push({data: 'dateParametrePattern', name: 'pattern paramètre', visible: true});
    this.columns.push({data: 'dateFichierPattern', name: 'pattern fichier', visible: true});
    this.columns.push({data: '', name: 'actions', visible: true, orderable: false});
  }

  ngOnInit() {
    this.addApplicationEnabled = this.globalSettingsService.createApplicationIsEnable();
    this.importApplicationEnabled = this.globalSettingsService.importApplicationIsEnable();

    this.dtOptions = {
      language: this.constants.datatable[this.translateService.currentLang] as LanguageSettings,
      order: [[2, 'asc']],
      stateSave: true,
            stateSaveParams(settings, data: any) {
              data.search.search = '';
            },
      pagingType: 'full_numbers',
      pageLength: this.constants.numberByPage,
      serverSide: true,
      processing: false,
      ajax: (dataTablesParameters: any, callback) => {
        this.applicationsService
          .getAllManage({
              page: dataTablesParameters.start / dataTablesParameters.length,
              size: dataTablesParameters.length,
              sort: dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
              name: dataTablesParameters.search.value
            }
          )
          .subscribe(resp => {
            this.applications = resp.content;
            callback({
              recordsTotal: resp.totalElements,
              recordsFiltered: resp.totalElements,
              data: []
            });
          });
      },
      columns: this.columns
    };
    this.dtTrigger.next(undefined);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(undefined);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  refreshApplication() {
    const that = this;
    this.dtElement.dtInstance.then((dtInstance: any) => {
      if (dtInstance.context[0].nTableWrapper == null) {
        // tslint:disable-next-line:only-arrow-functions
        setTimeout(function() {
          that.refreshApplication();
        }, 250);
      } else {
        dtInstance.destroy();
        this.dtTrigger.next(undefined);
      }
    });
  }

  onClickAddApplication() {
    const modalRef = this.modalService.open(ModalApplicationComponent);
    modalRef.result.then((result) => {
      this.toastService.showSuccess(`L'application ${result.name} a bien été ajoutée`);
      this.refreshApplication();
    }, (reason) => {
      if (reason.apierror.message !== undefined) {
        this.toastService.showError(`Une erreur est survenue lors de l'ajout de l'application : ${reason.apierror.message}`);
      }
    });
    modalRef.componentInstance.isUpdate = false;
  }

  onClickImportApplications() {
    this.applicationsService.importApplications().subscribe(
      () => {
        this.toastService.showSuccess(`Les applications ont bien étaient importées`);
        this.refreshApplication();
      }
      ,
      (error) => this.toastService.showError(`Une erreur est survenue lors de l'import des applications : ${error.message}`)
    );
  }

  editApplication(app: Application) {
    const modalRef = this.modalService.open(ModalApplicationComponent);
    modalRef.result.then((result) => {
      this.toastService.showSuccess(`L'application ${result.name} a bien été modifiée`);
      this.refreshApplication();
    }, (reason) => {
      if (reason.apierror.message !== undefined) {
        this.toastService.showError(`Une erreur est survenue lors de la modification de l'application : ${reason.apierror.message}`);
      }
    });
    modalRef.componentInstance.application = {...app};
    modalRef.componentInstance.isUpdate = true;
  }

  deleteApplication(app: Application) {
    const modalRef = this.modalService.open(ModalApplicationDeletionComponent);
    modalRef.result.then(() => {
      this.applicationsService.deleteApplication(app.id).subscribe(
        () => {
          this.toastService.showSuccess(`L'application a été supprimée`);
          this.refreshApplication();
        },
        reason => {
          this.toastService.showError(`Une erreur est survenue lors de la suppression de l'application : ${reason}`);
        }
      );
    });
    modalRef.componentInstance.application = app;
  }

  usersApplication(app: Application) {
    const modalRef = this.modalService.open(ModalUsersComponent, {size: 'lg'});
    this.applicationsService.getUsersFromApplication(app.id)
      .subscribe(users => modalRef.componentInstance.usersApplication = users);
    modalRef.componentInstance.application = app;
  }

  managersApplication(app: Application) {
    const modalRef = this.modalService.open(ModalUsersComponent, {size: 'lg'});
    this.applicationsService.getModeratorsFromApplication(app.id)
      .subscribe(users => modalRef.componentInstance.usersApplication = users);
    modalRef.componentInstance.application = app;
    modalRef.componentInstance.isModerator = true;
  }

  onResizeTable(event){
    if (event.oldWidth === undefined || event.newWidth === event.oldWidth){
      return;
    }
    this.refreshApplication();
  }

}
