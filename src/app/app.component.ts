import {Component, OnInit} from '@angular/core';

import {ApiService, UserService} from './core';
import {environment} from "../environments/environment";
import {OauthService} from "./security/oauth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private userService: UserService,
    private oauthService: OauthService
  ) {
    this.oauthService.runInitialLoginSequence();
  }

  ngOnInit() {
    if (! environment.jwt ) {
      console.log("OAUTH ENABLE");
    }
    this.userService.populate();
  }
}
