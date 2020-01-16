import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Application} from '../core/models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileKindsService} from '../core/services/file-kinds.service';
import {ModalNamingComponent} from './modal-naming/modal-naming.component';
import {ModalNamingDeletionComponent} from './modal-naming-deletion/modal-naming-deletion.component';
import {FileKind} from "../core/models/file-kind.model";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {Constants} from "../shared/Constants";
import {ToastService} from "../core/services/toast.service";

@Component({
  selector: 'app-manage-naming',
  templateUrl: './manage-naming.component.html',
  styleUrls: ['./manage-naming.component.scss']
})
export class ManageNamingComponent implements AfterViewInit, OnDestroy, OnInit {
  applicationSelected: Application;
  namings: FileKind[];

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  constructor(private fileKindsService: FileKindsService,
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
        if (!this.applicationSelected) {
          this.namings = [];
          return
        }
        this.fileKindsService
          .getAllFromApplication(this.applicationSelected.id, {
              'page': dataTablesParameters.start / dataTablesParameters.length,
              'size': dataTablesParameters.length,
              'sort': dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
              'name': dataTablesParameters.search.value
            }
          )
          .subscribe(resp => {
            this.namings = resp.content;
            callback({
              recordsTotal: resp.totalElements,
              recordsFiltered: resp.totalElements,
              data: []
            });
          });
      },
      columns: [{
        data: 'id'
      }, {data: 'name'}, {data: 'pattern'},{
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

  refreshNaming() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  applicationChanged(application: Application) {
    this.applicationSelected = application;
    this.refreshNaming();
  }


  onClickAddNaming() {
    const modalRef = this.modalService.open(ModalNamingComponent);
    modalRef.result.then((result) => {
      this.toastService.showSuccess(`Le nommage ${result.name} a bien été ajouté`);
      this.applicationChanged(this.applicationSelected);
    }, (reason) => {
      if (reason.message !== undefined) {
        this.toastService.showError( `Une erreur est survenue lors de l'ahout du nommage : ${reason.message}`);
      }
    });
    modalRef.componentInstance.application = this.applicationSelected;
    modalRef.componentInstance.isUpdate = false;
  }

  editNaming(naming: FileKind) {
    const modalRef = this.modalService.open(ModalNamingComponent);
    modalRef.result.then((result) => {
      this.toastService.showSuccess(`Le nommage ${result.name} a bien été modifié`);
      this.applicationChanged(this.applicationSelected);
    }, (reason) => {
      if (reason.message !== undefined) {
        this.toastService.showError( `Une erreur est survenue lors de la modification du nommage : ${reason.message}`);
      }
    });
    modalRef.componentInstance.application = this.applicationSelected;
    modalRef.componentInstance.fileKind = naming;
    modalRef.componentInstance.isUpdate = true;
  }

  deleteNaming(naming: FileKind) {
    const modalRef = this.modalService.open(ModalNamingDeletionComponent);
    modalRef.result.then((result) => {
      this.fileKindsService.deleteNaming(naming).subscribe(
        fileKind => {
          this.toastService.showSuccess(`Le nommage a été supprimé`);
          this.applicationChanged(this.applicationSelected);
        },
        reason => {
          this.toastService.showError( `Une erreur est survenue lors de la suppression du nommage : ${reason}`);
        }
      );
    }, reason => {
    });
    modalRef.componentInstance.application = this.applicationSelected;
    modalRef.componentInstance.fileKind = naming;
    modalRef.componentInstance.isUpdate = true;
  }
}

