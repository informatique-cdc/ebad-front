import {Audit} from './audit.model';
import {Account} from './account.model';
import {Application} from './application.model';

export interface User extends Account, Audit {
  id: number;
  activated: boolean;
  activationKey: string;
  authorities: string[];
  token: string;
}
