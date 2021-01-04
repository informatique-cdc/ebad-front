import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {UserService} from './user.service';
import {take, tap} from 'rxjs/operators';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {OauthService} from "../../security/oauth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService,
    private oauthService: OauthService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean>{
    if(environment.jwt) {
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
            this.router.navigate(['login', {referer: state.url}]);
          }
        }
      );
      return canActivate;
    }else {
      console.log("canActivate oauth");
      return this.oauthService.canActivateProtectedRoutes$
        .pipe(tap(x => {
          console.log('You tried to go to ' + state.url + ' and this guard said ' + x);
          if(!x){
            this.router.navigate(['login', {referer: state.url}]);
          }
        }));
    }
  }
}
