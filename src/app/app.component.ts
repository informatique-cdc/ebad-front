import {Component, OnInit} from '@angular/core';

import {ApiService, UserService} from './core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean;
  constructor(
    private userService: UserService,
    private translate: TranslateService
  ) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }

  ngOnInit() {
    this.userService.populate();
    this.userService.isAuthenticated.subscribe((result) => this.isAuthenticated = result);
  }
}
