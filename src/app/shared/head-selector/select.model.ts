import {Option} from './option.model';

export class Select {
  id: string;
  options: Option[];

  constructor(id: string, options: Option[]) {
    this.id = id;
    this.options = options || [];
  }
}
