import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {OauthService} from "./oauth.service";

@Injectable()
export class OauthGuard implements CanActivate {
  constructor(
    private oauthService: OauthService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.oauthService.canActivateProtectedRoutes$
      .pipe(tap(x => console.log('You tried to go to ' + state.url + ' and this guard said ' + x)));
  }
}
