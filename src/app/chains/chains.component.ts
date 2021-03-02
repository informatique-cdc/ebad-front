import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChainsService, EnvironmentsService, Chain, Environment, InfoEnvironment} from '../core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {Constants} from '../shared/Constants';
import {ToastService} from '../core/services/toast.service';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-chains',
  templateUrl: './chains.component.html'
})
export class ChainsComponent implements AfterViewInit, OnDestroy, OnInit {
  environmentSelected: Environment;
  environmentSelectedInfo: InfoEnvironment;

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  chains: Chain[];
  columns = []

  constructor(private environmentsService: EnvironmentsService,
              private chainsService: ChainsService,
              private toastService: ToastService,
              private constants: Constants,
              private translateService: TranslateService) {
    this.columns.push({data: 'id', name: 'id', visible: true});
    this.columns.push({data: 'name', name: 'nom', visible: true});
    this.columns.push({data: 'description', name: 'description', visible: true});
    this.columns.push({data: '', name: 'action', visible: true, orderable: false});
  }

  ngOnInit() {
    this.dtOptions = {
      language: {
        url: `assets/i18n/datatable-${this.translateService.currentLang}.json`
      },
      order: [[0, 'asc']],
      pagingType: 'full_numbers',
      pageLength: this.constants.numberByPage,
      serverSide: true,
      processing: false,
      ajax: (dataTablesParameters: any, callback) => {
        if (!this.environmentSelected) {
          this.chains = [];
          return;
        }
        this.chainsService
          .getAllFromEnvironment(this.environmentSelected.id, {
              page: dataTablesParameters.start / dataTablesParameters.length,
              size: dataTablesParameters.length,
              sort: dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
              name: dataTablesParameters.search.value
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
    this.chainsService.run(chain.id).subscribe(
      () => {
          this.toastService.showSuccess('La chaine ' + chain.name + ' vient d\'être lancée');
      },
      err => {
        this.toastService.showError( err || 'Une erreur est survenue');

      }
    );
  }
}
