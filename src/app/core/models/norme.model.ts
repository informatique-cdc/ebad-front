import {Audit} from './audit.model';

export interface Norme extends Audit {
  id: number;
  name: string;
  commandLine: string;
  ctrlMDate: string;
  pathShell: string;
}
