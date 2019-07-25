import {Component, OnInit} from '@angular/core';
import {Chain, Environment, InfoEnvironment} from '../core/models';
import {ChainsService, EnvironmentsService} from '../core/services';
import {Action, ColumnsDefinition, Table} from '../shared/table/table.model';
import {ActionClickEvent} from '../shared/table/action-click-event.model';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-chains',
  templateUrl: './chains.component.html',
  styleUrls: ['./chains.component.scss']
})
export class ChainsComponent implements OnInit {
  environmentSelected: Environment;
  environmentSelectedInfo: InfoEnvironment;
  table: Table;

  private idActionRun = 'runChain';

  constructor(private environmentsService: EnvironmentsService,
              private chainsService: ChainsService,
              private notifierService: NotifierService) {
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
    this.showChains();
  }

  showChains() {
    this.table = new Table();
    this.table.showHeader = true;

    this.table.settings.columnsDefinition.name = new ColumnsDefinition();
    this.table.settings.columnsDefinition.name.title = 'Nom';
    this.table.settings.columnsDefinition.name.order = 1;
    this.table.settings.columnsDefinition.description = new ColumnsDefinition();
    this.table.settings.columnsDefinition.description.title = 'Description';
    this.table.settings.columnsDefinition.description.order = 2;

    this.table.settings.actionsDefinition.title = 'Action';
    this.table.settings.actionsDefinition.actions.push(new Action('Lancer', this.idActionRun));
    this.chainsService.getAllFromEnvironment(this.environmentSelected.id).subscribe(
      chains => {
        this.table.items = chains;
      }
    );
  }

  onActionClicked(event: ActionClickEvent) {
    if (event.id === this.idActionRun) {
      const chain: Chain = event.item;
      this.runChain(chain);
      return;
    }
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
        console.log(err);
        this.notifierService.notify('error', err || 'Une erreur est survenue');

      }
    );
  }
}
