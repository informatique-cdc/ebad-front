import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BatchsService, EnvironmentsService} from '../core/services';
import {Batch, Environment, InfoEnvironment} from '../core/models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Constants} from '../shared/Constants';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ToastService} from '../core/services/toast.service';
import {ModalAddSchedulingComponent} from "./modal-add-scheduling/modal-add-scheduling.component";
import {Scheduling} from "../core/models/scheduling.model";
import {SchedulingsService} from "../core/services/schedulings.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ModalBatchComponent} from "../manage-batchs/modal-batch/modal-batch.component";

@Component({
  selector: 'app-schedulings-page',
  templateUrl: './schedulings.component.html',
  styleUrls: ['./schedulings.component.scss']
})
export class SchedulingsComponent implements AfterViewInit, OnDestroy, OnInit {
  environmentSelected: Environment;
  schedulings: Scheduling[];

  @ViewChild(DataTableDirective, {static: true})
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  public progress: any = {};

  constructor(
    private environmentsService: EnvironmentsService,
    private schedulingsService: SchedulingsService,
    private constants: Constants,
    private toastService: ToastService,
    private translateService: TranslateService,
    private modalService: NgbModal) {
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
          this.schedulings = [];
          return;
        }
        this.schedulingsService
          .getAllFromEnvironment(this.environmentSelected.id, {
              page: dataTablesParameters.start / dataTablesParameters.length,
              size: dataTablesParameters.length,
              sort: dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
              name: dataTablesParameters.search.value
            }
          )
          .subscribe(resp => {
            this.schedulings = resp.content;
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

  refreshSchedulings() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  environmentChanged(env: Environment) {
    this.environmentSelected = env;
    this.refreshSchedulings();
  }

  deleteScheduling(scheduling: Scheduling) {
    this.schedulingsService.delete(scheduling).subscribe(
      () => {
        this.translateService.get('SCHEDULING.MSG.DELETION_SUCCESS').subscribe((msg) => this.toastService.showSuccess(msg));
        this.refreshSchedulings();
      },
      error => this.translateService.get('SCHEDULING.MSG.DELETION_ERROR', {msg: error}).subscribe(msg => this.toastService.showError(msg))
    );
  }

  onClickAddScheduling() {
    const modalRef = this.modalService.open(ModalAddSchedulingComponent);
    modalRef.result.then((result) => {
      this.toastService.showSuccess(`Le batch ${result.name} a bien été ajouté`);
      this.refreshSchedulings();
    }, (reason) => {
      if (reason.message !== undefined) {
        this.toastService.showError(`Une erreur est survenue lors de l'ahout du batch : ${reason.message}`);
      }
    });
    modalRef.componentInstance.environment = this.environmentSelected;
  }

}

