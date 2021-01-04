import {HttpClientModule} from '@angular/common/http';
import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {
  AuthConfig,
  OAuthModule,
  OAuthModuleConfig,
  OAuthStorage,
  ValidationHandler
} from 'angular-oauth2-oidc';
import {JwksValidationHandler} from 'angular-oauth2-oidc-jwks';
import {AuthGuard} from "../core/services";
import {OauthService} from "./oauth.service";
import {oauthConfig} from "./oauth-config";
import {oauthModuleConfig} from "./oauth-module-config";
import {OauthGuardWithForcedLogin} from "./oauth-guard-with-forced-login.service";

export function storageFactory(): OAuthStorage {
  return localStorage;
}

@NgModule({
  imports: [
    HttpClientModule,
    OAuthModule.forRoot()
  ],
  providers: [
    OauthService,
    AuthGuard,
    OauthGuardWithForcedLogin,
  ],
})

export class SecurityModule {
  static forRoot(): ModuleWithProviders<SecurityModule> {
    return {
      ngModule: SecurityModule,
      providers: [
        { provide: AuthConfig, useValue: oauthConfig },
        { provide: OAuthModuleConfig, useValue: oauthModuleConfig },
        { provide: ValidationHandler, useClass: JwksValidationHandler },
        { provide: OAuthStorage, useFactory: storageFactory },
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: SecurityModule) {
    if (parentModule) {
      throw new Error('SecurityModule is already loaded. Import it in the AppModule only');
    }
  }
}
