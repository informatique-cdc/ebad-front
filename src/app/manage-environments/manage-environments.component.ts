import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Application, Environment, ApplicationsService, EnvironmentsService, GlobalSettingsService} from '../core';
import {ModalEnvironmentComponent} from './modal-environment/modal-environment.component';
import {ModalEnvironmentDeletionComponent} from './modal-environment-deletion/modal-environment-deletion.component';
import {Constants} from '../shared/Constants';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ToastService} from '../core/services/toast.service';
import {TranslateService} from '@ngx-translate/core';
import LanguageSettings = DataTables.LanguageSettings;
import {ModalEnvironmentTerminalComponent} from './modal-environment-terminal/modal-environment-terminal.component';

@Component({
    selector: 'app-manage-environments',
    templateUrl: './manage-environments.component.html'
})
export class ManageEnvironmentsComponent implements AfterViewInit, OnDestroy, OnInit {
    applicationSelected: Application;
    addEnvironmentEnabled = true;
    importEnvironmentEnabled = true;
    terminalEnabled = false;

    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: DataTables.Settings = {};

    environments: Environment[] = [];

    columns = [];

    constructor(private environmentsService: EnvironmentsService,
                private modalService: NgbModal,
                private applicationsService: ApplicationsService,
                private constants: Constants,
                private toastService: ToastService,
                private globalSettingsService: GlobalSettingsService,
                private translateService: TranslateService) {
        this.columns.push({data: 'id', name: 'id', visible: true});
        this.columns.push({data: 'name', name: 'Nom', visible: true});
        this.columns.push({data: 'host', name: 'Serveur', visible: true});
        this.columns.push({data: 'identity', name: 'Identity', visible: true});
        this.columns.push({data: 'homePath', name: 'Home', visible: true});
        this.columns.push({data: 'prefix', name: 'Préfix', visible: true});
        this.columns.push({data: '', name: 'Action', orderable: false, visible: true});
    }


    applicationChanged(application: Application) {
        // this.refreshEnvironments();
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
        this.terminalEnabled = this.globalSettingsService.terminalIsEnable();

        this.dtOptions = {
            language: this.constants.datatable[this.translateService.currentLang] as LanguageSettings,
            stateSave: true,
            stateSaveParams(settings, data: any) {
                data.search.search = '';
            },
            order: [[0, 'asc']],
            pagingType: 'full_numbers',
            pageLength: this.constants.numberByPage,
            serverSide: true,
            processing: false,
            ajax: (dataTablesParameters: any, callback) => {
                if (!this.applicationSelected) {
                    this.environments = [];
                    return;
                }
                this.environmentsService
                    .getEnvironmentFromApp(this.applicationSelected.id, {
                            page: dataTablesParameters.start / dataTablesParameters.length,
                            size: dataTablesParameters.length,
                            sort: dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
                            name: dataTablesParameters.search.value
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

    refreshEnvironments() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next(undefined);
        });
    }

    onClickShowTerminal(env: Environment) {
        const modalRef = this.modalService.open(ModalEnvironmentTerminalComponent, {size: 'xl'});
        modalRef.result.then((result) => {
        });
        modalRef.componentInstance.environment = {...env};
    }

    onClickAddEnvironment() {
        const modalRef = this.modalService.open(ModalEnvironmentComponent);
        modalRef.result.then((result) => {
            this.toastService.showSuccess(`L'environnement ${result.name} a bien été ajouté`);
            this.applicationChanged(this.applicationSelected);
        }, (reason) => {
            if (reason.apierror.message !== undefined) {
                this.toastService.showError(`Une erreur est survenue lors de l'ahout de l'environnement : ${reason.apierror.message}`);
            }
        });
        modalRef.componentInstance.application = this.applicationSelected;
        modalRef.componentInstance.isUpdate = false;
    }

    onClickImportEnvironments() {
        this.environmentsService.importEnvironmentToApp(this.applicationSelected.id).subscribe(
            () => {
                this.toastService.showSuccess(`Les environnements ont bien été importés`);
                this.refreshEnvironments();
            },
            (error) => this.toastService.showError(`Une erreur est survenue lors de l'import des environnments : ${error.message}`)
        );
    }

    editEnvironment(env: Environment) {
        const modalRef = this.modalService.open(ModalEnvironmentComponent);
        modalRef.result.then((result) => {
            this.toastService.showSuccess(`L'environnement ${result.name} a bien été modifié`);
            this.applicationChanged(this.applicationSelected);
        }, (reason) => {
            if (reason.apierror.message !== undefined) {
                this.toastService.showError(`Une erreur est survenue lors de la modification de l'environnement : ${reason.apierror.message}`);
            }
        });
        modalRef.componentInstance.application = this.applicationSelected;
        modalRef.componentInstance.environment = {...env};
        modalRef.componentInstance.isUpdate = true;
    }

    deleteEnvironment(env: Environment) {
        const modalRef = this.modalService.open(ModalEnvironmentDeletionComponent);
        modalRef.result.then(() => {
            this.environmentsService.deleteEnvironemnt(env.id).subscribe(
                () => {
                    this.toastService.showSuccess(`L'environnement a été supprimé`);
                    this.applicationChanged(this.applicationSelected);
                },
                reason => {
                    this.toastService.showError(`Une erreur est survenue lors de la suppression de l'environnement : ${reason}`);
                }
            );
        });
        modalRef.componentInstance.application = this.applicationSelected;
        modalRef.componentInstance.environment = env;
        modalRef.componentInstance.isUpdate = true;
    }

    onResizeTable(event) {
        if (event.oldWidth == undefined || event.newWidth === event.oldWidth) {
            return;
        }
        this.refreshEnvironments();
    }
}
