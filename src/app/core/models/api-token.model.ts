import {Audit} from './audit.model';

export interface ApiToken extends Audit {
  id: number;
  name: string;
  token: string;
}
