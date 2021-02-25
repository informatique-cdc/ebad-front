import {Injectable} from '@angular/core';
import {User} from '../models';


@Injectable()
export class RoleService {

  isModo(user: User): boolean {
    if (user.usageApplications === undefined) {
      return false;
    }
    for (const usageApp of user.usageApplications) {
      if (usageApp.canManage) {
        return true;
      }
    }
    return false;
  }

  hasThisRole(role: string, user: User): boolean {
    const roles = user.authorities;
    if (role === 'ROLE_MODO') {
      return this.isModo(user);
    }

    if (roles === undefined) {
      return false;
    }

    const result = roles.find((obj: any) => {
      return obj.name === role;
    });

    return result !== undefined;
  }

  hasRoleSearch(user: User, roles: string[] ){
    let hasRole  = false;
    roles.forEach(role => {
      hasRole = hasRole || this.hasThisRole(role, user);
    });

    return hasRole;
  }


}
