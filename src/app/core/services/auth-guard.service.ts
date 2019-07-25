import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {UserService} from './user.service';
import {take} from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('can activate ' + state.url);
    let canActivate = false;
    this.userService.isAuthenticated.pipe(take(1)).subscribe(
      (isAuthenticated: boolean) => {
        if (isAuthenticated) {
          console.log('allow');
          canActivate = true;
        } else {
          console.log('denied');
          canActivate = false;
          this.router.navigate(['login']);
        }
      }
    );
    return canActivate;
  }
}
