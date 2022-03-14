import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';

import {ApiService} from './api.service';
import {JwtService} from './jwt.service';
import {User} from '../models';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {OauthService} from '../../security/oauth.service';
import {RxStompService} from '@stomp/ng2-stompjs';
import {ConfigService} from './config.service';


@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated;
  private configService: ConfigService;
  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private jwtService: JwtService,
    private oauthService: OauthService,
    private rxStompService: RxStompService,

  ) {
  }

  initConfiguration(configService: ConfigService){
    this.configService = configService;
    if (this.configService.jwt) {
      this.isAuthenticated = this.isAuthenticatedSubject.asObservable();
    } else {
      this.isAuthenticated = this.oauthService.isAuthenticated$;
    }
  }

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
      this.apiService.get('/users/current')
        .subscribe(
          data => {
            data.token = this.jwtService.getToken();
            this.setAuth(data);
          },
          err => this.purgeAuth()
        );
    } else if (this.configService.jwt) {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }


  setAuth(user: User) {

    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);

    const config = {
      brokerURL: this.configService.wsUrl,
      connectHeaders: {Authorization: this.jwtService.getToken()},
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 20000
    };
    this.rxStompService.configure(config);
    this.rxStompService.activate();
  }

  purgeAuth() {
    this.rxStompService.deactivate();
    if (!this.configService.jwt) {
      this.oauthService.logout();
    }
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);

  }

  attemptAuth(credentials): Observable<User> {
    const route =  '/authenticate';
    return this.apiService.post(route, credentials)
      .pipe(map(
        data => {
          this.setAuth(data);
          return data;
        }
      ));
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  // Update the user on the server (email, pass, etc)
  update(user): Observable<User> {
    return this.apiService
      .put('/user', {user})
      .pipe(map(data => {
        // Update the currentUser observable
        this.currentUserSubject.next(data);
        return data;
      }));
  }

}
