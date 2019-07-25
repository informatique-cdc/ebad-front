import {Audit} from './audit.model';
import {Application} from './application.model';

export interface FileKind extends Audit {
  id: number;
  name: string;
  pattern: string;
  application: Application
}
