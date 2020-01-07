import {Batch} from './batch.model';
import {Environment} from './environment.model';
import {User} from './user.model';

export interface Trace {
  id: number;
  logDate: Date;
  batch: Batch;
  environnement: Environment;
  executionTime: number;
  params: string;
  returnCode: number;
  login: string;
}
