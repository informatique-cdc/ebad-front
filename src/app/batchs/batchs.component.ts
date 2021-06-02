import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Batch, Environment, InfoEnvironment, BatchsService, EnvironmentsService, JwtService} from '../core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalRunWithParametersComponent} from './modal-run-with-parameters/modal-run-with-parameters.component';
import {Constants} from '../shared/Constants';
import {DataTableDirective} from 'angular-datatables';
import {Subject, Subscription} from 'rxjs';
import {ToastService} from '../core/services/toast.service';
import {TranslateService} from '@ngx-translate/core';
import LanguageSettings = DataTables.LanguageSettings;
import {EventSourcePolyfill} from 'event-source-polyfill';
import {NgZone} from '@angular/core';
import {SseService} from "../core/services/sse.service";

@Component({
  selector: 'app-batchs-page',
  templateUrl: './batchs.component.html',
  styleUrls: ['./batchs.component.scss']
})
export class BatchsComponent implements AfterViewInit, OnDestroy, OnInit {
  environmentSelected: Environment;
  batchs: Batch[];

  @ViewChild(DataTableDirective, {static: true})
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  environmentSelectedInfo: InfoEnvironment;
  columns = [];

  public progress: any = {};
  private eventSource: EventSourcePolyfill;
  private test = 0;
  private zone = new NgZone({enableLongStackTrace: false});

  constructor(
    private batchsService: BatchsService,
    private environmentsService: EnvironmentsService,
    private constants: Constants,
    private toastService: ToastService,
    private modalService: NgbModal,
    private translateService: TranslateService,
    private sseService: SseService
    ) {
    this.columns.push({data: 'id', name: 'id', visible: true});
    this.columns.push({data: 'name', name: 'nom', visible: true});
    this.columns.push({data: 'path', name: 'shell', visible: true});
    this.columns.push({data: 'defaultParam', name: 'parametres par defaut', visible: true, orderable: false});
    this.columns.push({data: '', name: 'actions', visible: true, orderable: false});
  }

  ngOnInit() {
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
        if (!this.environmentSelected) {
          this.batchs = [];
          return;
        }
        this.batchsService
          .getAllFromEnvironment(this.environmentSelected.id, {
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
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  refreshBatchs() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  environmentChanged(env: Environment) {
    this.environmentSelected = env;
    this.environmentSelectedInfo = null;
    this.environmentsService.getInfo(this.environmentSelected.id).subscribe(
      environment => {
        this.environmentSelectedInfo = environment;
      }
    );
    this.refreshBatchs();

    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = this.sseService.getIndicatorsStream('/batchs/state/' + env.id);
    this.test++;
    this.eventSource.onmessage = (event) => {
        this.zone.run(() => {
          console.log(this.test+'test ' + event.data);
        });
      };
    this.eventSource.onerror = (error) => console.error(error);

  }



  runBatchWithCustomParam(batch: Batch) {
    const modalRef = this.modalService.open(ModalRunWithParametersComponent);
    modalRef.result.then((parameters) => {
      this.runBatch(batch, false, parameters);
    }, (reason) => {
      console.debug(`Dismissed ${reason}`);
    });
    modalRef.componentInstance.batchName = batch.name;
    modalRef.componentInstance.parameters = batch.defaultParam;
  }

  runBatch(batch: Batch, defaultParams: boolean, param?: string) {

    const apiParams: any = {env: this.environmentSelected.id};

    if (param) {
      apiParams.param = param;
    }

    if (defaultParams) {
      apiParams.param = batch.defaultParam;
    }

    this.batchsService.run(batch.id, apiParams).subscribe(
      id => {
        this.toastService.showSuccess('Le batch ' + batch.name + ' vient d\'être lancé');
      },
      err => {
        this.toastService.showError(err || 'Une erreur est survenue');
      }
    );
  }

  onResizeTable(event) {
    if (event.oldWidth === undefined || event.newWidth === event.oldWidth) {
      return;
    }
    this.refreshBatchs();
  }
}

