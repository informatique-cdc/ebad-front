import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EnvironmentsService, Environment} from '../core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Constants} from '../shared/Constants';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ToastService} from '../core/services/toast.service';
import {ModalAddSchedulingComponent} from './modal-add-scheduling/modal-add-scheduling.component';
import {Scheduling} from '../core/models/scheduling.model';
import {SchedulingsService} from '../core/services/schedulings.service';
import {TranslateService} from '@ngx-translate/core';
import LanguageSettings = DataTables.LanguageSettings;

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
  columns = [];

  constructor(
    private environmentsService: EnvironmentsService,
    private schedulingsService: SchedulingsService,
    private constants: Constants,
    private toastService: ToastService,
    private translateService: TranslateService,
    private modalService: NgbModal,) {
    this.columns.push({data: 'id', name: 'id', visible: true});
    this.columns.push({data: 'batch.name', name: 'nom', visible: true});
    this.columns.push({data: 'parameters', name: 'paramètres', visible: true});
    this.columns.push({data: 'cron', name: 'cron', visible: true});
    this.columns.push({data: '', name: 'action', visible: true, orderable: false});
  }

  ngOnInit() {
    this.dtOptions = {
      language: this.constants.datatable[this.translateService.currentLang] as LanguageSettings,
      stateSave: true,
            stateSaveParams: function (settings, data: any) {
              data.search.search = "";
            },
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
    modalRef.result.then(() => {
      this.translateService.get('SCHEDULING.MSG.ADD_SUCCESS').subscribe((msg) => this.toastService.showSuccess(msg));
      this.refreshSchedulings();
    }, (reason) => {
      if (reason.message !== undefined) {
        this.translateService.get('SCHEDULING.MSG.ADD_ERROR', {msg: reason.message}).subscribe((msg) => this.toastService.showError(msg));
      }
    });
    modalRef.componentInstance.environment = this.environmentSelected;
  }

  onResizeTable(event){
    if(event.oldWidth == undefined || event.newWidth === event.oldWidth){
      return;
    }
    this.refreshSchedulings();
  }
}

