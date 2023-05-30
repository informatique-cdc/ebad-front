import {Injectable} from '@angular/core';

import {ConfigService} from './config.service';
import {AuthConfig} from 'angular-oauth2-oidc';


@Injectable()
export class InitAuthConfigService {

  constructor(private configService: ConfigService) {
  }

  loadConfig(): AuthConfig {
    const authConfig = new AuthConfig();
    authConfig.issuer = this.configService.issuer;
    authConfig.clientId = this.configService.clientId;
    // authConfig.loginUrl = this.configService.loginUrl;
    authConfig.redirectUri = window.location.origin + '/';
    authConfig.silentRefreshRedirectUri = window.location.origin + '/silent-refresh.html';
    authConfig.useSilentRefresh = true;
    authConfig.requireHttps = false;
    authConfig.scope = this.configService.scope;
    authConfig.silentRefreshTimeout = 5000;
    authConfig.timeoutFactor = 0.25;
    authConfig.sessionChecksEnabled = this.configService.sessionChecksEnabled;
    authConfig.showDebugInformation = true;
    authConfig.clearHashAfterLogin = false;
    // authConfig.logoutUrl = this.configService.logoutUrl;
    authConfig.userinfoEndpoint = this.configService.userinfoEndpoint;
    authConfig.strictDiscoveryDocumentValidation = false;
    authConfig.disableAtHashCheck = true;
    authConfig.postLogoutRedirectUri = window.location.origin + '/';
    authConfig.skipSubjectCheck = true;
    authConfig.responseType = 'code';
    // responseType: "code",
    // tokenEndpoint: environment.tokenEndpoint
    return authConfig;
  }
}
