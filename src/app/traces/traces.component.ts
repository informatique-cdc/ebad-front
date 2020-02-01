import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Environment, Trace} from '../core/models';
import {TracesService} from '../core/services/traces.service';
import {Constants} from '../shared/Constants';
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";

@Component({
  selector: 'app-traces',
  templateUrl: './traces.component.html',
  styleUrls: ['./traces.component.scss']
})
export class TracesComponent implements AfterViewInit, OnDestroy, OnInit {
  environmentSelected: Environment;
  traces: Trace[];

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  constructor(private tracesService: TracesService,
              private constants: Constants) {
  }

  ngOnInit() {
    this.dtOptions = {
      order: [[0, 'desc']],
      pagingType: 'full_numbers',
      pageLength: this.constants.numberByPage,
      serverSide: true,
      processing: false,
      ajax: (dataTablesParameters: any, callback) => {
        if (!this.environmentSelected) {
          this.traces = [];
          return
        }
        this.tracesService
          .getAllFromEnvironment(this.environmentSelected.id, {
              'page': dataTablesParameters.start / dataTablesParameters.length,
              'size': dataTablesParameters.length,
              'sort': dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
              'batch.name': dataTablesParameters.search.value
            }
          )
          .subscribe(resp => {
            this.traces = resp.content;
            callback({
              recordsTotal: resp.totalElements,
              recordsFiltered: resp.totalElements,
              data: []
            });
          });
      },
      columns: [{
        data: 'id'
      }, {data: 'batch.name'}, {data: 'dateTraitement'}, {data: 'params'}, {
        data: 'login'
      },{data: 'logDate'},{data: 'executionTime'},{data:'returnCode'}]
    };
    this.dtTrigger.next();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  refreshTraces() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  environmentChanged(env: Environment) {
    this.environmentSelected = env;
    this.refreshTraces();
  }


}
