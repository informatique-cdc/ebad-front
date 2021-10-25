import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalNormComponent} from './modal-norm/modal-norm.component';
import {ModalNormDeletionComponent} from './modal-norm-deletion/modal-norm-deletion.component';
import {Constants} from '../shared/Constants';
import {Subject} from 'rxjs';
import {Norme, NormsService} from '../core';
import {ToastService} from '../core/services/toast.service';
import {TranslateService} from '@ngx-translate/core';
import {DataTableDirective} from 'angular-datatables';
import LanguageSettings = DataTables.LanguageSettings;

@Component({
    selector: 'app-admin-norms',
    templateUrl: './admin-norms.component.html'
})
export class AdminNormsComponent implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: DataTables.Settings = {};

    norms: Norme[];
    columns = [];

    constructor(private modalService: NgbModal,
                private constants: Constants,
                private toastService: ToastService,
                private normsService: NormsService,
                private translateService: TranslateService) {
        this.columns.push({data: 'id', name: 'id', visible: true});
        this.columns.push({data: 'name', name: 'nom', visible: true});
        this.columns.push({data: 'commandLine', name: 'interpréteur', visible: true});
        this.columns.push({data: 'pathShell', name: 'dossier shell', visible: true});
        this.columns.push({data: 'ctrlMDate', name: 'fichier date', visible: true});
        this.columns.push({data: '', name: 'actions', visible: true, orderable: false});

    }

    ngOnInit() {
        this.dtOptions = {
            language: this.constants.datatable[this.translateService.currentLang] as LanguageSettings,
            stateSave: true,
            stateSaveParams: function(settings, data: any) {
                data.search.search = '';
            },
            order: [[1, 'asc']],
            pagingType: 'full_numbers',
            pageLength: this.constants.numberByPage,
            serverSide: true,
            processing: false,
            ajax: (dataTablesParameters: any, callback) => {
                this.normsService
                    .getAll({
                            page: dataTablesParameters.start / dataTablesParameters.length,
                            size: dataTablesParameters.length,
                            sort: dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
                            name: dataTablesParameters.search.value
                        }
                    )
                    .subscribe(resp => {
                        this.norms = resp.content;
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


    refreshNorms() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    onClickAddNorm() {
        const modalRef = this.modalService.open(ModalNormComponent);
        modalRef.result.then(() => {
            this.toastService.showSuccess(`La norme a bien été ajoutée`);
            this.refreshNorms();
        }, (reason) => {
            if (reason.apierror.message !== undefined) {
                this.toastService.showError(`Une erreur est survenue lors de l'ajout de la norme : ${reason.apierror.message}`);
            }
        });
        modalRef.componentInstance.isUpdate = false;
    }

    editNorm(norm: Norme) {
        const modalRef = this.modalService.open(ModalNormComponent);
        modalRef.result.then(() => {
            this.toastService.showSuccess(`La norme a bien été modifiée`);
            this.refreshNorms();
        }, (reason) => {
            if (reason.apierror.message !== undefined) {
                this.toastService.showError(`Une erreur est survenue lors de la modification de la norme : ${reason.apierror.message}`);
            }
        });
        modalRef.componentInstance.norm = {...norm};
        modalRef.componentInstance.isUpdate = true;
    }

    deleteNorm(norm: Norme) {
        const modalRef = this.modalService.open(ModalNormDeletionComponent);
        modalRef.result.then(() => {
            this.normsService.deleteNorm(norm.id).subscribe(
                () => {
                    this.toastService.showSuccess(`La norme a été supprimée`);
                    this.refreshNorms();
                },
                reason => {
                    this.toastService.showError(`Une erreur est survenue lors de la suppression de la norme : ${reason.apierror.message}`);
                }
            );
        });
        modalRef.componentInstance.norm = norm;
    }

    onResizeTable(event) {
        if (event.oldWidth === undefined || event.newWidth === event.oldWidth) {
            return;
        }
        this.refreshNorms();
    }
}


