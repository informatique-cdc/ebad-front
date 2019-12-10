import { AuthConfig } from 'angular-oauth2-oidc';
import {environment} from "../../environments/environment";

export const oauthConfig: AuthConfig = {
  issuer: environment.issuer,
  clientId: environment.clientId,
  loginUrl: environment.loginUrl,
  redirectUri: window.location.origin,
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  scope: environment.scope,
  silentRefreshTimeout: 5000,
  timeoutFactor: 0.25,
  sessionChecksEnabled: true,
  showDebugInformation: true,
  clearHashAfterLogin: true,
  logoutUrl: environment.logoutUrl,
  userinfoEndpoint: environment.userinfoEndpoint,
  strictDiscoveryDocumentValidation: false,
  requireHttps: false,
  disableAtHashCheck: true,
  postLogoutRedirectUri: window.location.origin + '/'
};
