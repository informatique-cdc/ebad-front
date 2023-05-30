import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {Observable} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';

import {AuthService} from './oauth.service';

@Injectable()
export class OauthGuardWithForcedLogin  {
  private isAuthenticated: boolean;

  constructor(
    private authService: AuthService,
  ) {
    this.authService.isAuthenticated$.subscribe(i => this.isAuthenticated = i);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.authService.isDoneLoading$
      .pipe(filter(isDone => isDone))
      .pipe(tap(_ => this.isAuthenticated || this.authService.login(state.url)))
      .pipe(map(_ => this.isAuthenticated));
    //FIXME DTROUILLET LOOP
    return this.authService.isDoneLoading$;
  }
}
