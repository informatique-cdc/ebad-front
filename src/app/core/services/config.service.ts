import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})export class ConfigService {
  baseUrl: string;
  production: boolean;
  jwt: boolean;
  apiUrl: string;
  scope: string;
  atHash: string;
  issuer: string;
  clientId: string;
  loginUrl: string;
  logoutUrl: string;
  userinfoEndpoint: string;
  wsUrl: string;
  tokenEndpoint: string;
  sessionChecksEnabled: boolean;

  public isReadySubject = new ReplaySubject<boolean>(1);
  public isReady = this.isReadySubject.asObservable();

}
