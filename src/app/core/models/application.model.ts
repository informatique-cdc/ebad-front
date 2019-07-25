import {Environment} from './environment.model';
import {Audit} from './audit.model';

export interface Application extends Audit {
  id: number;
  name: string;
  code: string;
  dateFichierPattern: string;
  dateParametrePattern: string;
  environnements: Environment[];
}
