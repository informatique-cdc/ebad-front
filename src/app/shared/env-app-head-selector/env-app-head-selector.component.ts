import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventSelectChangeModel, Option, Select} from '../head-selector';
import {Application, Environment} from '../../core/models';
import {ApplicationsService, EnvironmentsService, SelectChoicesService} from '../../core/services';
import {Pageable} from "../../core/models/pageable.model";

@Component({
  selector: 'app-env-app-head-selector',
  templateUrl: './env-app-head-selector.component.html',
  styleUrls: ['./env-app-head-selector.component.scss']
})
export class EnvAppHeadSelectorComponent implements OnInit {
  private idSelectApplication = 'selectApplication';
  private idSelectEnvironnement = 'selectEnvironnement';

  selectHead: Select[] = [];
  private applications: Application[] = [];

  private environmentSelected: Environment;

  @Input() title;
  @Input() preTitle;
  @Input() showEnvironment = true;
  @Input() isModarable = false;
  @Output() environmentChanged = new EventEmitter<Environment>();
  @Output() applicationChanged = new EventEmitter<Application>();

  constructor(private applicationsService: ApplicationsService,
              private environmentsService: EnvironmentsService,
              private selectChoicesService: SelectChoicesService) {
  }

  ngOnInit() {
    if (!this.isModarable) {
      this.applicationsService.getAll(new Pageable(0, 100)).subscribe(
        applications => {
          this.applications = applications.content;
          this.constructSelect();
        }
      );
    } else {
      this.applicationsService.getAllModerable(new Pageable(0, 100)).subscribe(
        applications => {
          this.applications = applications.content;
          this.constructSelect();
        }
      );
    }
  }

  constructSelect() {
    const optionsApplication: Option[] = [];
    const optionsEnvironnement: Option[] = [];

    const selectApplication = new Select(this.idSelectApplication, optionsApplication);
    const selectEnvironnement = new Select(this.idSelectEnvironnement, optionsEnvironnement);

    this.selectHead.push(selectApplication);
    if (this.showEnvironment) {
      this.selectHead.push(selectEnvironnement);
    }

    const appIdSelected = this.selectChoicesService.getSelectedApp();
    if (appIdSelected) {
      optionsApplication.push(new Option('', 'Application', false));
    } else {
      optionsApplication.push(new Option('', 'Application', true));
      optionsEnvironnement.push(new Option('', 'Environnements', true));
    }

    for (const app of this.applications) {
      let selected = false;
      if (appIdSelected == app.id + '') {
        selected = true;
        this.showChanged(new EventSelectChangeModel(this.idSelectApplication, app), true);
      }
      optionsApplication.push(new Option(app, app.name, selected));
    }
  }

  updateSelectEnvironment(environnements: Environment[]) {
    this.environmentSelected = null;

    const optionsEnvironnement: Option[] = [];

    const envIdSelected = this.selectChoicesService.getSelectedEnv();
    if(envIdSelected){
      optionsEnvironnement.push(new Option('', 'Environnements', false));
    }else {
      optionsEnvironnement.push(new Option('', 'Environnements', true));
    }
    for (const env of environnements) {
      let select = false;
      if (envIdSelected == env.id + '') {
        select = true;
        this.showChanged(new EventSelectChangeModel(this.idSelectEnvironnement, env), true);
      }
      optionsEnvironnement.push(new Option(env, env.name, select));
    }

    this.selectHead[1].options = optionsEnvironnement;
  }

  showChanged(event: EventSelectChangeModel, init: boolean = false) {
    if(!init){
      this.selectChoicesService.selectEnv(null);
      //this.selectChoicesService.selectApp(null);
    }

    if (event.idSelect === this.idSelectApplication) {
      if (this.showEnvironment) {

        this.environmentsService.getEnvironmentFromApp(event.value.id, new Pageable(0, 100, 'name,asc'))
          .subscribe((page) => this.updateSelectEnvironment(page.content));
      }

      this.selectChoicesService.selectApp(event.value as Application);
      this.applicationChanged.emit(event.value);
    }

    if (event.idSelect === this.idSelectEnvironnement) {
      this.selectChoicesService.selectEnv(event.value as Environment);
      this.environmentChanged.emit(event.value);
    }
  }
}
