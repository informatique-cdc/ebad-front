import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventSelectChangeModel, Option, Select} from '../head-selector';
import {Application, Environment} from '../../core/models';
import {ApplicationsService} from '../../core/services';
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
  customTitle;

  @Input() title;
  @Input() showEnvironment = true;
  @Input() isModarable = false;
  @Output() environmentChanged = new EventEmitter<Environment>();
  @Output() applicationChanged = new EventEmitter<Application>();

  constructor(private applicationsService: ApplicationsService) {
  }

  ngOnInit() {
    this.customTitle = this.title;
    if (!this.isModarable) {
      this.applicationsService.getAll(new Pageable(0,100)).subscribe(
        applications => {
          this.applications = applications.content;
          this.constructSelect();
        }
      );
    } else {
      this.applicationsService.getAllModerable(new Pageable(0,100)).subscribe(
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

    optionsApplication.push(new Option('', 'Application', true));
    for (const app of this.applications) {
      optionsApplication.push(new Option(app, app.name, false));
    }

    optionsEnvironnement.push(new Option('', 'Environnements', true));
  }

  updateSelectEnvironment(environnements: Environment[]) {
    this.environmentSelected = null;

    const optionsEnvironnement: Option[] = [];
    optionsEnvironnement.push(new Option('', 'Environnements', true));

    for (const env of environnements) {
      optionsEnvironnement.push(new Option(env, env.name, false));
    }

    this.selectHead[1].options = optionsEnvironnement;
  }

  showChanged(event: EventSelectChangeModel) {
    if (event.idSelect === this.idSelectApplication) {
      if (this.showEnvironment) {
        this.updateSelectEnvironment(event.value.environnements);
      }
      this.customTitle = `${this.title} - ${event.value.name}`;
      this.applicationChanged.emit(event.value);
    }

    if (event.idSelect === this.idSelectEnvironnement) {
      this.environmentChanged.emit(event.value);
    }
  }
}
