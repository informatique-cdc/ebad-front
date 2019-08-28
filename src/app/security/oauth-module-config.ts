import { OAuthModuleConfig } from 'angular-oauth2-oidc';

export const oauthModuleConfig: OAuthModuleConfig = {
  resourceServer: {
    allowedUrls: ['http://localhost:8080'],
    sendAccessToken: true,
  }
};
