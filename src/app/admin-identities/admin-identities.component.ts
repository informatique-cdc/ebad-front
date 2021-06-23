import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Constants} from '../shared/Constants';
import {Subject} from 'rxjs';
import {ToastService} from '../core/services/toast.service';
import {TranslateService} from '@ngx-translate/core';
import {DataTableDirective} from 'angular-datatables';
import LanguageSettings = DataTables.LanguageSettings;
import {Identity} from '../core/models/identity.model';
import {IdentitiesService} from '../core/services/identities.service';
import {ModalIdentityComponent} from './modal-identity/modal-identity.component';
import {ModalIdentityDeletionComponent} from './modal-identity-deletion/modal-identity-deletion.component';

@Component({
    selector: 'app-admin-identities',
    templateUrl: './admin-identities.component.html'
})
export class AdminIdentitiesComponent implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: DataTables.Settings = {};

    identities: Identity[];
    columns = [];

    constructor(private modalService: NgbModal,
                private constants: Constants,
                private toastService: ToastService,
                private identitiesService: IdentitiesService,
                private translateService: TranslateService) {
        this.columns.push({data: 'id', name: 'id', visible: true});
        this.columns.push({data: 'name', name: 'nom', visible: true});
        this.columns.push({data: 'login', name: 'login', visible: true});
        this.columns.push({data: '', name: 'actions', visible: true, orderable: false});

    }

    ngOnInit() {
        this.dtOptions = {
            language: this.constants.datatable[this.translateService.currentLang] as LanguageSettings,
            stateSave: true,
            stateSaveParams(settings, data: any) {
                data.search.search = '';
            },
            order: [[1, 'asc']],
            pagingType: 'full_numbers',
            pageLength: this.constants.numberByPage,
            serverSide: true,
            processing: false,
            ajax: (dataTablesParameters: any, callback) => {
                this.identitiesService
                    .getAll({
                            page: dataTablesParameters.start / dataTablesParameters.length,
                            size: dataTablesParameters.length,
                            sort: dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
                            name: dataTablesParameters.search.value
                        }
                    )
                    .subscribe(resp => {
                        this.identities = resp.content;
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


    refreshIdentities() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
        });
    }

    onClickAddIdentity() {
      const modalRef = this.modalService.open(ModalIdentityComponent);
      modalRef.result.then(() => {
        this.toastService.showSuccess(`La norme a bien été ajoutée`);
        this.refreshIdentities();
      }, (reason) => {
        if (reason.message !== undefined) {
          this.toastService.showError( `Une erreur est survenue lors de l'ajout de la norme : ${reason.message}`);
        }
      });
      modalRef.componentInstance.isUpdate = false;
    }

    editIdentity(identity: Identity) {
      const modalRef = this.modalService.open(ModalIdentityComponent);
      modalRef.result.then(() => {
        this.toastService.showSuccess(`La norme a bien été modifiée`);
        this.refreshIdentities();
      }, (reason) => {
        if (reason.message !== undefined) {
          this.toastService.showError( `Une erreur est survenue lors de la modification de la norme : ${reason.message}`);
        }
      });
      this.identitiesService.getIdentity(identity.id).subscribe(value => modalRef.componentInstance.identity = value);
      modalRef.componentInstance.isUpdate = true;
    }

    deleteIdentity(identity: Identity) {
      const modalRef = this.modalService.open(ModalIdentityDeletionComponent);
      modalRef.result.then(() => {
        this.identitiesService.deleteIdentity(identity.id).subscribe(
          () => {
            this.toastService.showSuccess(`La norme a été supprimée`);
            this.refreshIdentities();
          },
          reason => {
            this.toastService.showError( `Une erreur est survenue lors de la suppression de la norme : ${reason.detail}`);
          }
        );
      });
      modalRef.componentInstance.identity = identity;
    }

    onResizeTable(event) {
        if (event.oldWidth === undefined || event.newWidth === event.oldWidth) {
            return;
        }
        this.refreshIdentities();
    }
}


