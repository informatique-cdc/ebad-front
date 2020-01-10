import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NormsService} from '../core/services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalNormComponent} from './modal-norm/modal-norm.component';
import {ModalNormDeletionComponent} from './modal-norm-deletion/modal-norm-deletion.component';
import {Constants} from "../shared/Constants";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {Norme} from "../core/models";

@Component({
  selector: 'app-admin-norms',
  templateUrl: './admin-norms.component.html',
  styleUrls: ['./admin-norms.component.scss']
})
export class AdminNormsComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  norms: Norme[];

  constructor(private modalService: NgbModal,
              private constants: Constants,
              private normsService: NormsService) {
  }

  ngOnInit() {
    this.dtOptions = {
      order: [[1, 'asc']],
      pagingType: 'full_numbers',
      pageLength: this.constants.numberByPage,
      serverSide: true,
      processing: false,
      ajax: (dataTablesParameters: any, callback) => {
        this.normsService
          .getAll({
              'page': dataTablesParameters.start / dataTablesParameters.length,
              'size': dataTablesParameters.length,
              'sort': dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
              'name': dataTablesParameters.search.value
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
      columns: [{data: 'id'}, {data: 'name'}, {data: 'commandLine'}, {data: 'pathShell'}, {data: 'ctrlMDate'},
        {
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


  refreshNorms() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  onClickAddNorm() {
    const modalRef = this.modalService.open(ModalNormComponent);
    modalRef.result.then((result) => {
      // this.notifierService.notify('success', `La norme a bien été ajoutée`);
      this.refreshNorms();
    }, (reason) => {
      if (reason.message !== undefined) {
        // this.notifierService.notify('error', `Une erreur est survenue lors de l'ajout de la norme : ${reason.message}`);
      }
    });
    modalRef.componentInstance.isUpdate = false;
  }

  editNorm(norm: Norme) {
    const modalRef = this.modalService.open(ModalNormComponent);
    modalRef.result.then((result) => {
      // this.notifierService.notify('success', `La norme a bien été modifiée`);
      this.refreshNorms();
    }, (reason) => {
      if (reason.message !== undefined) {
        // this.notifierService.notify('error', `Une erreur est survenue lors de la modification de la norme : ${reason.message}`);
      }
    });
    modalRef.componentInstance.norm = norm;
    modalRef.componentInstance.isUpdate = true;
  }

  deleteNorm(norm: Norme) {
    const modalRef = this.modalService.open(ModalNormDeletionComponent);
    modalRef.result.then((result) => {
      this.normsService.deleteNorm(norm.id).subscribe(
        () => {
          // this.notifierService.notify('success', `La norme a été supprimée`);
          this.refreshNorms();
        },
        reason => {
          // this.notifierService.notify('error', `Une erreur est survenue lors de la suppression de la norme : ${reason.detail}`);
        }
      );
    }, reason => {
    });
    modalRef.componentInstance.norm = norm;
  }

}


