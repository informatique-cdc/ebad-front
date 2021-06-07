import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Application, Batch, BatchsService} from '../core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalBatchComponent} from './modal-batch/modal-batch.component';
import {ModalBatchDeletionComponent} from './modal-batch-deletion/modal-batch-deletion.component';
import {Constants} from '../shared/Constants';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ToastService} from '../core/services/toast.service';
import {TranslateService} from '@ngx-translate/core';
import LanguageSettings = DataTables.LanguageSettings;

@Component({
  selector: 'app-manage-batchs',
  templateUrl: './manage-batchs.component.html'
})
export class ManageBatchsComponent implements AfterViewInit, OnDestroy, OnInit {
  applicationSelected: Application;
  batchs: Batch[];

  @ViewChild(DataTableDirective, {static: true})
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  columns = [];

  constructor(private batchsService: BatchsService,
              private modalService: NgbModal,
              private toastService: ToastService,
              private constants: Constants,
              private translateService: TranslateService) {
    this.columns.push({data: 'id', name: 'id', visible: true});
    this.columns.push({data: 'name', name: 'nom', visible: true});
    this.columns.push({data: 'path', name: 'shell', visible: true});
    this.columns.push({data: 'environnements', name: 'environnements', visible: true, orderable: false});
    this.columns.push({data: '', name: 'actions', visible: true, orderable: false});
  }

  applicationChanged(application: Application) {
    this.applicationSelected = application;
    this.refreshBatchs();
  }

  ngOnInit() {
    this.dtOptions = {
      language: this.constants.datatable[this.translateService.currentLang] as LanguageSettings,
      stateSave: true,
            stateSaveParams: function (settings, data: any) {
              data.search.search = '';
            },
      order: [[0, 'asc']],
      pagingType: 'full_numbers',
      pageLength: this.constants.numberByPage,
      serverSide: true,
      processing: false,
      ajax: (dataTablesParameters: any, callback) => {
        if (!this.applicationSelected) {
          this.batchs = [];
          return;
        }
        this.batchsService
          .getAllFromApplication(this.applicationSelected.id, {
              page: dataTablesParameters.start / dataTablesParameters.length,
              size: dataTablesParameters.length,
              sort: dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
              name: dataTablesParameters.search.value
            }
          )
          .subscribe(resp => {
            this.batchs = resp.content;
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

  refreshBatchs() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }


  onClickAddBatch() {
    const modalRef = this.modalService.open(ModalBatchComponent);
    modalRef.result.then((result) => {
      this.toastService.showSuccess(`Le batch ${result.name} a bien été ajouté`);
      this.applicationChanged(this.applicationSelected);
    }, (reason) => {
      if (reason.message !== undefined) {
        this.toastService.showError(`Une erreur est survenue lors de l'ahout du batch : ${reason.message}`);
      }
    });
    modalRef.componentInstance.application = this.applicationSelected;
    modalRef.componentInstance.isUpdate = false;
  }

  editBatch(batch: Batch) {
    const modalRef = this.modalService.open(ModalBatchComponent);
    modalRef.result.then((result) => {
      this.toastService.showSuccess(`Le batch ${result.name} a bien été modifié`);
      this.applicationChanged(this.applicationSelected);
    }, (reason) => {
      if (reason.message !== undefined) {
        this.toastService.showError(`Une erreur est survenue lors de la modification du batch : ${reason.message}`);
      }
    });
    modalRef.componentInstance.application = this.applicationSelected;
    modalRef.componentInstance.batch = {...batch};
    modalRef.componentInstance.isUpdate = true;
  }

  deleteBatch(batch: Batch) {
    const modalRef = this.modalService.open(ModalBatchDeletionComponent);
    modalRef.result.then(() => {
      this.batchsService.delete(batch).subscribe(
        () => {
          this.toastService.showSuccess(`Le batch ${batch.name} a été supprimé`);
          this.applicationChanged(this.applicationSelected);
        },
        reason => {
          this.toastService.showError(`Une erreur est survenue lors de la suppression du batch : ${reason}`);
        }
      );
    });
    modalRef.componentInstance.application = this.applicationSelected;
    modalRef.componentInstance.batch = batch;
    modalRef.componentInstance.isUpdate = true;
  }

  onResizeTable(event){
    if(event.oldWidth == undefined || event.newWidth === event.oldWidth){
      return;
    }
    this.refreshBatchs();
  }
}
