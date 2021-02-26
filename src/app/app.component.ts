import {Component, OnInit} from '@angular/core';

import {GlobalSettingsService, UserService} from './core';
import {TranslateService} from '@ngx-translate/core';
import {OauthService} from './security/oauth.service';
import {environment} from '../environments/environment';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean;

  constructor(
    private userService: UserService,
    private router: Router,
    private translate: TranslateService,
    private oauthService: OauthService,
    private globalSettingsService: GlobalSettingsService
  ) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }

  ngOnInit() {
    if (!environment.jwt) {
      this.oauthService.runInitialLoginSequence().then().catch(
        (error) => {
          console.error('error when run initial login sequence ' + error);
          this.router.navigateByUrl('/login');
        }
      );
    }else {
      this.userService.populate();
    }

    this.userService.isAuthenticated.subscribe((result) => {
      this.isAuthenticated = result;
      if (result){
        if (!environment.jwt) {
          this.userService.populate();
        }
        this.globalSettingsService.populateGlobalSetting();
      }
    }, (error) => {
      console.error(error);
    });
  }
}
