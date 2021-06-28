import {Norme} from './norme.model';
import {Audit} from './audit.model';
import {Application} from './application.model';
import {Identity} from './identity.model';

export interface Environment extends Audit {
  id: number;
  name: string;
  homePath: string;
  host: string;
  identity: Identity;
  norme: Norme;
  prefix: string;
  application: Application;
}
