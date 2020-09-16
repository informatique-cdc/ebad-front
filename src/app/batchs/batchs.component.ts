import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BatchsService, EnvironmentsService} from '../core/services';
import {Batch, Environment, InfoEnvironment} from '../core/models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalRunWithParametersComponent} from './modal-run-with-parameters/modal-run-with-parameters.component';
import {Constants} from "../shared/Constants";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {ToastService} from "../core/services/toast.service";

@Component({
  selector: 'app-batchs-page',
  templateUrl: './batchs.component.html',
  styleUrls: ['./batchs.component.scss']
})
export class BatchsComponent implements AfterViewInit, OnDestroy, OnInit {
  environmentSelected: Environment;
  batchs: Batch[];

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  environmentSelectedInfo: InfoEnvironment;

  constructor(
    private batchsService: BatchsService,
    private environmentsService: EnvironmentsService,
    private constants: Constants,
    private toastService: ToastService,
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
          this.batchs = [];
          return
        }
        this.batchsService
          .getAllFromEnvironment(this.environmentSelected.id, {
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

  environmentChanged(env: Environment) {
    this.environmentSelected = env;
    this.environmentSelectedInfo = null;
    this.environmentsService.getInfo(this.environmentSelected.id).subscribe(
      environment => {
        this.environmentSelectedInfo = environment;
      }
    );
    this.refreshBatchs();
  }


  runBatchWithCustomParam(batch: Batch) {
    const modalRef = this.modalService.open(ModalRunWithParametersComponent);
    modalRef.result.then((parameters) => {
      this.runBatch(batch, parameters);
    }, (reason) => {
      console.log(`Dismissed ${reason}`);
    });
    modalRef.componentInstance.batchName = batch.name;
    modalRef.componentInstance.parameters = batch.defaultParam;
  }


  runBatch(batch, param? : string) {
    this.toastService.showInfo('Votre batch vient d\'être lancé');

    let apiParams: any = {env: this.environmentSelected.id};

    if(param){
      apiParams.param = param;
    }

    this.batchsService.run(batch.id, apiParams).subscribe(
      trace => {
        if (trace.returnCode === 0) {
          this.toastService.showSuccess('Le batch ' + batch.name + ' s\'est terminé avec le code ' + trace.returnCode);
        } else {
          this.toastService.showError( 'Le batch ' + batch.name + ' s\'est terminé avec le code ' + trace.returnCode);
        }
      },
      err => {
        this.toastService.showError( err || 'Une erreur est survenue');

      }
    );
  }
}

