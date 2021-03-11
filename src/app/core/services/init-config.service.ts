import {Injectable} from '@angular/core';

import {Observable, ObservableInput, of} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "./config.service";
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../environments/environment";


@Injectable()
export class InitConfigService {

  constructor(private httpClient: HttpClient, private configService: ConfigService ) {
  }

  loadConfig(): (() => Promise<boolean>) {
    return (): Promise<boolean> => {
      return new Promise<boolean>((resolve: (a: boolean) => void): void => {
        this.httpClient.get(environment.configLocation)
          .pipe(
            map((x: ConfigService) => {
              this.configService.baseUrl = x.baseUrl;
              this.configService.apiUrl = x.apiUrl;
              this.configService.apiUrl = x.apiUrl;
              this.configService.clientId = x.clientId;
              this.configService.issuer = x.issuer;
              this.configService.jwt = x.jwt;
              this.configService.loginUrl = x.loginUrl;
              this.configService.logoutUrl = x.logoutUrl;
              this.configService.production = x.production;
              this.configService.scope = x.scope;
              this.configService.tokenEndpoint = x.tokenEndpoint;
              this.configService.userinfoEndpoint = x.userinfoEndpoint;
              this.configService.wsUrl = x.wsUrl;
              this.configService.sessionChecksEnabled = x.sessionChecksEnabled
              resolve(true);
            }),
            catchError((x: { status: number }, caught: Observable<void>): ObservableInput<{}> => {
              if (x.status !== 404) {
                resolve(false);
              }
              this.configService.baseUrl = 'http://localhost:8080/api';
              resolve(true);
              return of({});
            })
          ).subscribe();
      });
    };
  }
}
