import {Component, Injector, OnInit} from '@angular/core';

import {GlobalSettingsService, UserService} from './core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from './security/oauth.service';
import {Router} from '@angular/router';
import {SidebarService} from './core/services/sidebar.service';
import {ConfigService} from './core/services/config.service';
import {InitAuthConfigService} from './core/services/init-oauth-config.service';
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean;
  asideVisible = true;
  private authService: AuthService;
  isAuthenticated$: Observable<boolean>;
  isDoneLoading$: Observable<boolean>;
  canActivateProtectedRoutes$: Observable<boolean>;
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
      this.authService = this.injector.get(AuthService);
      this.isAuthenticated$ = this.authService.isAuthenticated$;
      this.isDoneLoading$ = this.authService.isDoneLoading$;
      this.canActivateProtectedRoutes$ = this.authService.canActivateProtectedRoutes$;
    }
  }

  ngOnInit() {
    this.userService.initConfiguration(this.configService);
    if (!this.configService.jwt) {
      // this.authService.configure(this.initAuthConfigService.loadConfig());
      // this.authService.runInitialLoginSequence().then().catch(
      //   (error) => {
      //     console.error('error when run initial login sequence ' + error);
      //     this.router.navigateByUrl('/login');
      //   }
      // );
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
