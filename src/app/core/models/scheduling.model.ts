import {Audit} from './audit.model';
import {Environment} from './environment.model';
import {Batch} from './batch.model';

export interface Scheduling extends Audit {
  id: number;
  batch: Batch;
  environnement: Environment;
  parameters: string;
  cron: string;
}
