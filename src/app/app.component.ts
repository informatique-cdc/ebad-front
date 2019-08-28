import {Component, OnInit} from '@angular/core';

import {UserService} from './core';
import {OauthService} from "./security/oauth.service";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private userService: UserService,
    private oauthService: OauthService
  ) {
    if(!environment.jwt) {
      this.oauthService.runInitialLoginSequence();
    }
  }

  ngOnInit() {
    this.userService.populate();
  }
}
