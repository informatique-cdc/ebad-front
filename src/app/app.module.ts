import {APP_INITIALIZER, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AuthModule} from './auth/auth.module';
import {AsideComponent, FooterComponent, HeaderComponent, SharedModule} from './shared';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {IconsModule} from './icons';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeModule} from './home/home.module';
import {SecurityModule} from './security/security.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AccreditationRequestModule} from './accreditation-requests/accreditation-request.module';
import {AngularSvgIconModule} from 'angular-svg-icon';

import {InitConfigService} from './core/services/init-config.service';
import {RxStompService} from '@stomp/ng2-stompjs';
import {NgxResize} from 'ngx-resize';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function load(initConfigService: InitConfigService) {
  return () => initConfigService.loadConfig();
}

registerLocaleData(localeFr);

@NgModule({
  declarations: [AppComponent, FooterComponent, HeaderComponent, AsideComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AccreditationRequestModule,
    AuthModule,
    IconsModule,
    NgbModule,
    HomeModule,
    AngularSvgIconModule,
    SecurityModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxResize,
  ],
  providers: [{provide: LOCALE_ID, useValue: 'fr-FR'},
    {
      provide: APP_INITIALIZER,
      useFactory: load,
      deps: [
        InitConfigService
      ],
      multi: true
    },
  RxStompService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
