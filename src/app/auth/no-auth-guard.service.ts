import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import {Observable} from 'rxjs';

import {UserService} from '../core';
import {map, take} from 'rxjs/operators';

@Injectable()
export class NoAuthGuard  {
  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.userService.isAuthenticated.pipe(take(1), map(isAuth => {
      if (isAuth){
        this.router.navigateByUrl('/home');
      }
      return !isAuth;
    }));

  }
}
