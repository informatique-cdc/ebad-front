import {Component, OnInit} from '@angular/core';
import {Environment} from '../core/models';
import {ColumnsDefinition, Table} from '../shared/table/table.model';
import {TracesService} from '../core/services/traces.service';
import {Constants} from '../shared/Constants';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-traces',
  templateUrl: './traces.component.html',
  styleUrls: ['./traces.component.scss']
})
export class TracesComponent implements OnInit {
  environmentSelected: Environment;
  perPage = this.constants.numberByPage;
  pageNumber = 1;
  collectionSize = 0;
  private table: Table;

  constructor(private tracesService: TracesService,
              private constants: Constants,
              private datePipe: DatePipe) {
  }

  ngOnInit() {
  }

  environmentChanged(env: Environment) {
    this.environmentSelected = env;
    this.showTraces();
  }

  showTraces() {
    this.table = new Table();
    this.table.showHeader = false;
    this.table.showFooter = true;

    const columnsDefinition = this.table.settings.columnsDefinition;
    columnsDefinition.id = new ColumnsDefinition();
    columnsDefinition.id.title = 'Id';
    columnsDefinition.id.order = 1;

    columnsDefinition.batch = new ColumnsDefinition();
    columnsDefinition.batch.title = 'Batch';
    columnsDefinition.batch.order = 2;

    columnsDefinition.dateTraitement = new ColumnsDefinition();
    columnsDefinition.dateTraitement.title = 'Date Traitement';
    columnsDefinition.dateTraitement.order = 3;

    columnsDefinition.params = new ColumnsDefinition();
    columnsDefinition.params.title = 'Paramètres';
    columnsDefinition.params.order = 4;

    columnsDefinition.user = new ColumnsDefinition();
    columnsDefinition.user.title = 'Utilisateur';
    columnsDefinition.user.order = 5;

    columnsDefinition.logDate = new ColumnsDefinition();
    columnsDefinition.logDate.title = 'Exécution';
    columnsDefinition.logDate.order = 6;

    columnsDefinition.executionTime = new ColumnsDefinition();
    columnsDefinition.executionTime.title = 'Tps d\'éxecution';
    columnsDefinition.executionTime.order = 7;

    columnsDefinition.returnCode = new ColumnsDefinition();
    columnsDefinition.returnCode.title = 'Code retour';
    columnsDefinition.returnCode.order = 8;

    this.onPageChange(null);
  }

  onPageChange(event) {
    console.log(event);
    this.tracesService.getAllFromEnvironment(this.environmentSelected.id, {page: this.pageNumber, per_page: this.perPage}).subscribe(
      traces => {
        this.collectionSize = traces.totalElements;
        console.log(traces);
        this.table.items = [];
        for (const trace of traces.content) {
          const item: any = trace;
          item.batch = item.batch.name;
          item.user = item.user.login;
          item.dateTraitement = this.datePipe.transform(item.dateTraitement, 'dd/MM/yyyy');
          item.logDate = this.datePipe.transform(item.logDate, 'dd/MM/yyyy HH:mm:ss');
          this.table.items.push(item);
        }
      }
    );
  }

}
