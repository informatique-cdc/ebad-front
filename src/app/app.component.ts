import {Component, OnInit} from '@angular/core';

import {UserService} from './core';
import {TranslateService} from "@ngx-translate/core";
import {OauthService} from "./security/oauth.service";
import {environment} from "../environments/environment";
import {Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean;

  constructor(
    private userService: UserService,
    private translate: TranslateService,
    private oauthService: OauthService,
    private router: Router,
    private location: Location
  ) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }

  ngOnInit() {
    console.log(this.location.path());
    if (!environment.jwt) {
      this.oauthService.runInitialLoginSequence();
    }
    this.userService.populate();
    this.userService.isAuthenticated.subscribe((result) => this.isAuthenticated = result);
  }
}
