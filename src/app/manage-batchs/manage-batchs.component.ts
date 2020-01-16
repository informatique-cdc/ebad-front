import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Application, Batch} from '../core/models';
import {BatchsService} from '../core/services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalBatchComponent} from './modal-batch/modal-batch.component';
import {ModalBatchDeletionComponent} from './modal-batch-deletion/modal-batch-deletion.component';
import {Constants} from "../shared/Constants";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {ToastService} from "../core/services/toast.service";

@Component({
  selector: 'app-manage-batchs',
  templateUrl: './manage-batchs.component.html',
  styleUrls: ['./manage-batchs.component.scss']
})
export class ManageBatchsComponent implements AfterViewInit, OnDestroy, OnInit {
  applicationSelected: Application;
  batchs: Batch[];

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  constructor(private batchsService: BatchsService,
              private modalService: NgbModal,
              private toastService: ToastService,
              private constants: Constants,) {
  }

  applicationChanged(application: Application) {
    this.applicationSelected = application;
    this.refreshBatchs()
  }

  ngOnInit() {
    this.dtOptions = {
      order: [[0, 'asc']],
      pagingType: 'full_numbers',
      pageLength: this.constants.numberByPage,
      serverSide: true,
      processing: false,
      ajax: (dataTablesParameters: any, callback) => {
        if (!this.applicationSelected) {
          this.batchs = [];
          return
        }
        this.batchsService
          .getAllFromApplication(this.applicationSelected.id, {
              'page': dataTablesParameters.start / dataTablesParameters.length,
              'size': dataTablesParameters.length,
              'sort': dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
              'name': dataTablesParameters.search.value
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
      columns: [{
        data: 'id'
      }, {data: 'name'}, {data: 'path'}, {data: 'environnements', orderable: false}, {
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
        this.toastService.showError( `Une erreur est survenue lors de l'ahout du batch : ${reason.message}`);
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
        this.toastService.showError( `Une erreur est survenue lors de la modification du batch : ${reason.message}`);
      }
    });
    modalRef.componentInstance.application = this.applicationSelected;
    modalRef.componentInstance.batch = batch;
    modalRef.componentInstance.isUpdate = true;
  }

  deleteBatch(batch: Batch) {
    const modalRef = this.modalService.open(ModalBatchDeletionComponent);
    modalRef.result.then((result) => {
      this.batchsService.updateBatch(batch).subscribe(
        batch => {
          this.toastService.showSuccess(`Le batch ${batch.name} a été supprimé`);
          this.applicationChanged(this.applicationSelected);
        },
        reason => {
          this.toastService.showError( `Une erreur est survenue lors de la suppression du batch : ${reason}`);
        }
      );
    }, reason => {
    });
    modalRef.componentInstance.application = this.applicationSelected;
    modalRef.componentInstance.batch = batch;
    modalRef.componentInstance.isUpdate = true;
  }
}
