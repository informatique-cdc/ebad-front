import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Chain, Environment, InfoEnvironment} from '../core/models';
import {ChainsService, EnvironmentsService} from '../core/services';
import {Action, ColumnsDefinition, Table} from '../shared/table/table.model';
import {ActionClickEvent} from '../shared/table/action-click-event.model';
import {NotifierService} from 'angular-notifier';
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {Constants} from "../shared/Constants";

@Component({
  selector: 'app-chains',
  templateUrl: './chains.component.html',
  styleUrls: ['./chains.component.scss']
})
export class ChainsComponent implements AfterViewInit, OnDestroy, OnInit {
  environmentSelected: Environment;
  environmentSelectedInfo: InfoEnvironment;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  chains: Chain[];

  constructor(private environmentsService: EnvironmentsService,
              private chainsService: ChainsService,
              private notifierService: NotifierService,
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
        if (!this.environmentSelected) {
          this.chains = [];
          return
        }
        this.chainsService
          .getAllFromEnvironment(this.environmentSelected.id, {
              'page': dataTablesParameters.start / dataTablesParameters.length,
              'size': dataTablesParameters.length,
              'sort': dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
              'name': dataTablesParameters.search.value
            }
          )
          .subscribe(resp => {
            this.chains = resp.content;
            callback({
              recordsTotal: resp.totalElements,
              recordsFiltered: resp.totalElements,
              data: []
            });
          });
      },
      columns: [{
        data: 'id'
      }, {data: 'name'}, {data: 'description'}, {
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

  refreshChains() {
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
    this.refreshChains();
  }

  runChain(chain) {
    this.notifierService.notify('info', 'Votre chaine vient d\'être lancée');

    this.chainsService.run(chain.id, {env: this.environmentSelected.id}).subscribe(
      trace => {
        if (trace.returnCode === 0) {
          this.notifierService.notify('success', 'La chaine ' + chain.name + ' s\'est terminée avec le code ' + trace.returnCode);
        } else {
          this.notifierService.notify('error', 'Le chaine ' + chain.name + ' s\'est terminée avec le code ' + trace.returnCode);
        }
      },
      err => {
        this.notifierService.notify('error', err || 'Une erreur est survenue');

      }
    );
  }
}
