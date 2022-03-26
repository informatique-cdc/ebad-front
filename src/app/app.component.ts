import {Component, Injector, OnInit} from '@angular/core';

import {GlobalSettingsService, UserService} from './core';
import {TranslateService} from '@ngx-translate/core';
import {OauthService} from './security/oauth.service';
import {Router} from '@angular/router';
import {SidebarService} from './core/services/sidebar.service';
import {ConfigService} from './core/services/config.service';
import {InitAuthConfigService} from './core/services/init-oauth-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean;
  asideVisible = true;
  private oauthService: OauthService;

  constructor(
    private userService: UserService,
    private router: Router,
    private translate: TranslateService,
    private globalSettingsService: GlobalSettingsService,
    private sidebarService: SidebarService,
    private configService: ConfigService,
    private initAuthConfigService: InitAuthConfigService,
    private injector: Injector
  ) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
    if (!configService.jwt) {
      this.oauthService = (this.injector.get(OauthService) as OauthService);
    }
  }

  ngOnInit() {
    this.userService.initConfiguration(this.configService);
    if (!this.configService.jwt) {
      this.oauthService.configure(this.initAuthConfigService.loadConfig());
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
        if (!this.configService.jwt) {
          this.userService.populate();
        }
        this.globalSettingsService.populateGlobalSetting();
      }
    }, (error) => {
      console.error(error);
    });

    this.sidebarService.sidebarVisibilityChange.subscribe(value => this.asideVisible = value);

  }
}
