import {Injectable} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {ConfigService} from "./config.service";
import {environment} from "../../../environments/environment";


@Injectable()
export class InitConfigService {

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
  }

  loadConfig(): Promise<boolean> {
    return this.httpClient.get(environment.configLocation).toPromise().then((x: ConfigService) => {
      this.configService.baseUrl = x.baseUrl;
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
      this.configService.sessionChecksEnabled = x.sessionChecksEnabled;
      this.configService.isReadySubject.next(true);
      return true;
    }).catch((error) => {
      this.configService.apiUrl = "/api";
      this.configService.jwt = true;
      this.configService.wsUrl = "/ws";
      this.configService.isReadySubject.next(true);
      console.warn(error);
      console.warn("error, default config loaded");
      return true;
    });
  }
}
