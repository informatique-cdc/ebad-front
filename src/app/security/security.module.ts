import {HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {
  AuthConfig,
  OAuthModule,
  OAuthModuleConfig,
  OAuthStorage,
  ValidationHandler
} from 'angular-oauth2-oidc';
import {JwksValidationHandler} from 'angular-oauth2-oidc-jwks';
import {AuthGuard} from '../core';
import {AuthService} from './oauth.service';
import {OauthGuardWithForcedLogin} from './oauth-guard-with-forced-login.service';
import {authAppInitializerFactory} from './auth-app-initializer.factory';
import {InitAuthConfigService} from '../core/services/init-oauth-config.service';
import {InitConfigService} from '../core/services/init-config.service';

export function storageFactory(): OAuthStorage {
  return localStorage;
}

@NgModule({
  imports: [
    HttpClientModule,
    OAuthModule.forRoot()
  ],
  providers: [
    AuthService,
    AuthGuard,
    OauthGuardWithForcedLogin,
  ],
})

export class SecurityModule {
  static forRoot(): ModuleWithProviders<SecurityModule> {
    return {
      ngModule: SecurityModule,
      providers: [
        { provide: APP_INITIALIZER, useFactory: authAppInitializerFactory, deps: [AuthService, InitAuthConfigService, InitConfigService], multi: true },
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
