import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AuthModule} from './auth/auth.module';
import {AsideComponent, FooterComponent, HeaderComponent, SharedModule} from './shared';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {IconsModule} from './icons';
import {NotifierModule} from 'angular-notifier';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeModule} from './home/home.module';
import {SecurityModule} from "./security/security.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

registerLocaleData(localeFr);

@NgModule({
  declarations: [AppComponent, FooterComponent, HeaderComponent, AsideComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AuthModule,
    IconsModule,
    NgbModule,
    AppRoutingModule,
    NotifierModule,
    HomeModule,
    SecurityModule.forRoot()
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [{provide: LOCALE_ID, useValue: 'fr-FR'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
