import {Component, OnInit} from '@angular/core';
import {BatchsService, EnvironmentsService} from '../core/services';
import {Application, Batch, Environment, InfoEnvironment} from '../core/models';
import {Action, ColumnsDefinition, Table} from '../shared/table/table.model';
import {ActionClickEvent} from '../shared/table/action-click-event.model';
import {NotifierService} from 'angular-notifier';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalRunWithParametersComponent} from './modal-run-with-parameters/modal-run-with-parameters.component';
import {Constants} from "../shared/Constants";
import {Pageable} from "../core/models/pageable.model";

@Component({
  selector: 'app-batchs-page',
  templateUrl: './batchs.component.html',
  styleUrls: ['./batchs.component.scss']
})
export class BatchsComponent implements OnInit {


  private idActionRun = 'run';
  private idActionRunWithParameter = 'runWithParameter';
  environmentSelected: Environment;
  size = this.constants.numberByPage;
  page = 0;
  totalSize = 0;

  environmentSelectedInfo: InfoEnvironment;
  table: Table;

  constructor(
    private batchsService: BatchsService,
    private notifierService: NotifierService,
    private environmentsService: EnvironmentsService,
    private constants: Constants,
    private modalService: NgbModal) {
  }

  ngOnInit() {

  }


  environmentChanged(env: Environment) {
    this.environmentSelected = env;
    this.environmentSelectedInfo = null;
    this.environmentsService.getInfo(this.environmentSelected.id).subscribe(
      environment => {
        this.environmentSelectedInfo = environment;
      }
    );
    this.showBatch();
  }
  refreshBatchs(pageable?: Pageable) {
    this.batchsService.getAllFromEnvironment(this.environmentSelected.id).subscribe(
      batchs => {
        this.table.items = batchs.content;
        this.totalSize = batchs.totalElements;
      }
    );
  }

  showBatch() {
    this.table = new Table();
    this.table.showHeader = true;
    this.table.showFooter = true;

    this.table.settings.columnsDefinition.name = new ColumnsDefinition();
    this.table.settings.columnsDefinition.name.title = 'Nom';
    this.table.settings.columnsDefinition.name.order = 1;
    this.table.settings.columnsDefinition.path = new ColumnsDefinition();
    this.table.settings.columnsDefinition.path.title = 'Chemin du shell';
    this.table.settings.columnsDefinition.path.order = 2;

    this.table.settings.actionsDefinition.title = 'Action';
    this.table.settings.actionsDefinition.actions.push(new Action('Lancer', this.idActionRun));
    this.table.settings.actionsDefinition.actions.push(new Action('Lancer avec paramètre', this.idActionRunWithParameter));
    this.refreshBatchs(new Pageable(this.page-1, this.size))
  }

  onActionClicked(event: ActionClickEvent) {
    if (event.id === this.idActionRun) {
      const batch: Batch = event.item;
      this.runBatch(batch, batch.defaultParam);
      return;
    }

    if (event.id === this.idActionRunWithParameter) {
      const batch: Batch = event.item;
      const modalRef = this.modalService.open(ModalRunWithParametersComponent);
      modalRef.result.then((parameters) => {
        this.runBatch(batch, parameters);
      }, (reason) => {
        console.log(`Dismissed ${reason}`);
      });
      modalRef.componentInstance.batchName = batch.name;
      modalRef.componentInstance.parameters = batch.defaultParam;
    }
  }

  runBatch(batch, param) {
    this.notifierService.notify('info', 'Votre batch vient d\'être lancé');

    this.batchsService.run(batch.id, {env: this.environmentSelected.id, param}).subscribe(
      trace => {
        if (trace.returnCode === 0) {
          this.notifierService.notify('success', 'Le batch ' + batch.name + ' s\'est terminé avec le code ' + trace.returnCode);
        } else {
          this.notifierService.notify('error', 'Le batch ' + batch.name + ' s\'est terminé avec le code ' + trace.returnCode);
        }
      },
      err => {
        console.log(err);
        this.notifierService.notify('error', err || 'Une erreur est survenue');

      }
    );
  }

  onPageChange(event) {
    this.refreshBatchs(new Pageable(this.page-1, this.size))
  }
}

