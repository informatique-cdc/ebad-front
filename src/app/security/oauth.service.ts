import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {OAuthErrorEvent, OAuthService} from 'angular-oauth2-oidc';
import {BehaviorSubject, combineLatest, Observable, ReplaySubject} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {CustomValidationHandler} from "./CustomValidationHandler";

@Injectable({
  providedIn: 'root'
})
export class OauthService {
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  private isDoneLoadingSubject$ = new ReplaySubject<boolean>();
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  public canActivateProtectedRoutes$: Observable<boolean> = combineLatest(
    [this.isAuthenticated$,
    this.isDoneLoading$]
  ).pipe(map(values => values.every(b => b)));


  private navigateToLoginPage() {
    // TODO: Remember current URL
    this.router.navigate(['login']);
  }

  constructor(
    private oauthService: OAuthService,
    private router: Router,
  ) {
    // Useful for debugging:
    this.oauthService.events.subscribe(event => {
      if (event instanceof OAuthErrorEvent) {
        console.error(event);
        if (event.type !== 'silent_refresh_timeout') {
          this.router.navigate(['/error', {error: event.type}]); // FIXME DTROUILLET DESACTIVER SILENT REFRESH EN MODE NON CONNECTE
        }
      } else {
        console.warn(event);
      }
    });

    // This is tricky, as it might cause race conditions (where access_token is set in another
    // tab before everything is said and done there.
    // TODO: Improve this setup.
    window.addEventListener('storage', (event) => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      console.warn('Noticed changes to access_token (most likely from another tab), updating isAuthenticated');
      this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());

      if (!this.oauthService.hasValidAccessToken()) {
        // this.navigateToLoginPage();
      }
    });

    this.oauthService.events
      .subscribe(_ => {
        this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());
      });

    this.oauthService.events
      .pipe(filter(e => ['token_received'].includes(e.type)))
      .subscribe(e => this.oauthService.loadUserProfile());

    this.oauthService.events
      .pipe(filter(e => ['session_terminated', 'session_error'].includes(e.type)))
      .subscribe(e => this.navigateToLoginPage());

    this.oauthService.setupAutomaticSilentRefresh();
  }

  public runInitialLoginSequence(): Promise<void> {
    this.oauthService.tokenValidationHandler = new CustomValidationHandler();
    if (location.hash) {
      console.log('Encountered hash fragment, plotting as table...');
      console.table(location.hash.substr(1).split('&').map(kvp => kvp.split('=')));
    }

    return this.oauthService.tryLogin()
      .then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          this.isAuthenticatedSubject$.next(true);
          return Promise.resolve();
        }


        return this.oauthService.silentRefresh()
          .then(() => {
            Promise.resolve();
          })
          .catch(result => {

            const errorResponsesRequiringUserInteraction = [
              'interaction_required',
              'login_required',
              'account_selection_required',
              'consent_required'
            ];

            if (result
              && result.reason
              && errorResponsesRequiringUserInteraction.indexOf(result.reason.error) >= 0) {

              console.warn('User interaction is needed to log in, we will wait for the user to manually log in.');
              return Promise.resolve();
            }

            return Promise.reject(result);
          });

      }).catch((e) => {
        this.router.navigate(['login']);
      })

      .then(() => {
        this.isDoneLoadingSubject$.next(true);
        if (this.oauthService.state && this.oauthService.state !== 'undefined' && this.oauthService.state !== 'null') {
          console.log('There was state, so we are sending you to: ' + this.oauthService.state);
          this.router.navigate([this.oauthService.state]);
        }
  })
      .catch((error) => {
        this.isDoneLoadingSubject$.next(true);
      });
  }

  public login(targetUrl?: string) {
    this.oauthService.initImplicitFlow(encodeURIComponent(targetUrl || this.router.url));
  }

  public logout() {
    this.oauthService.logOut();
  }

  public refresh() {
    this.oauthService.silentRefresh();
  }

  public hasValidToken() {
    return this.oauthService.hasValidAccessToken();
  }

  public get accessToken() {
    return this.oauthService.getAccessToken();
  }

  public get identityClaims() {
    return this.oauthService.getIdentityClaims();
  }

  public get idToken() {
    return this.oauthService.getIdToken();
  }

  public get logoutUrl() {
    return this.oauthService.logoutUrl;
  }

}
