import {Environment} from './environment.model';
import {Audit} from './audit.model';

export interface Directory extends Audit {
  id: number;
  name: string;
  path: string;
  canWrite: boolean;
  environnement: Environment;
}
