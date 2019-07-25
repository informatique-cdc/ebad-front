import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';

export class Table {
  showHeader: boolean;
  showFooter: boolean;
  settings: Setting = new Setting();
  items: any[];
}

// https://github.com/Microsoft/TypeScript/issues/7803

export class Setting {
  columnsDefinition: ColumnsDefinitionObj = new ColumnsDefinitionObj();
  actionsDefinition: ActionDefinition = new ActionDefinition();
  globalAction: Action;
}

export class ColumnsDefinitionObj {
  [key: string]: ColumnsDefinition;
}

export class ColumnsDefinition {
  title: string;
  order: number;
}

export class ActionDefinition {
  title: string;
  actions: Action[] = [];
}

export class Action {
  label: string;
  id: string;

  constructor(label: string, id: string) {
    this.label = label;
    this.id = id;
  }
}
