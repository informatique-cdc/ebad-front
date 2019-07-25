import {Audit} from './audit.model';
import {Environment} from './environment.model';

export interface Batch extends Audit {
  id: number;
  name: string;
  path: string;
  defaultParam: string;
  environnements: Environment[];
}
