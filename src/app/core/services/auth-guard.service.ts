import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {UserService} from './user.service';
import {take, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {OauthService} from '../../security/oauth.service';
import {ConfigService} from "./config.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService,
    private oauthService: OauthService,
    private configService: ConfigService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean>{
    if (this.configService.jwt) {
      console.debug('can activate ' + state.url);
      let canActivate = false;
      this.userService.isAuthenticated.pipe(take(1)).subscribe(
        (isAuthenticated: boolean) => {
          if (isAuthenticated) {
            console.debug('allow');
            canActivate = true;
          } else {
            console.debug('denied');
            canActivate = false;
            this.router.navigate(['login', {referer: state.url}]);
          }
        }
      );
      return canActivate;
    }else {
      console.debug('canActivate oauth');
      return this.oauthService.canActivateProtectedRoutes$
        .pipe(tap(x => {
          console.log('You tried to go to ' + state.url + ' and this guard said ' + x);
          if (!x){
            this.router.navigate(['login', {referer: state.url}]);
          }
        }));
    }
  }
}
