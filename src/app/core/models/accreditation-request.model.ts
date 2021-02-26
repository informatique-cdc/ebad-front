import {Audit} from './audit.model';
import {User} from './user.model';
import {Application} from './application.model';

export interface AccreditationRequest extends Audit {
  id: number;
  user: User;
  wantManage: boolean;
  wantUse: boolean;
  application: Application;
  state: string;
}
