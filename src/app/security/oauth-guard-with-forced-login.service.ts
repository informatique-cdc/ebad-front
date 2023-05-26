import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {Observable} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';

import {OauthService} from './oauth.service';

@Injectable()
export class OauthGuardWithForcedLogin  {
  private isAuthenticated: boolean;

  constructor(
    private oauthService: OauthService,
  ) {
    this.oauthService.isAuthenticated$.subscribe(i => this.isAuthenticated = i);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.oauthService.isDoneLoading$
      .pipe(filter(isDone => isDone))
      .pipe(tap(_ => this.isAuthenticated || this.oauthService.login(state.url)))
      .pipe(map(_ => this.isAuthenticated));
  }
}
