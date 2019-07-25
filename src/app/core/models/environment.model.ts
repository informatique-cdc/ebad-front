import {Norme} from './norme.model';
import {Audit} from './audit.model';
import {Application} from './application.model';

export interface Environment extends Audit {
  id: number;
  name: string;
  homePath: string;
  host: string;
  login: string;
  norme: Norme;
  prefix: string;
  application: Application;
}
