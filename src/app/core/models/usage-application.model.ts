import {User} from './user.model';

export interface UsageApplication {
  applicationId: number;
  user?: User;
  canManage: boolean;
  canUse: boolean;
}
