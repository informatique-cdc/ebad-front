import {Component, OnInit} from '@angular/core';

import {ApiService, UserService} from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean;
  constructor(
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.userService.populate();
    this.userService.isAuthenticated.subscribe((result) => this.isAuthenticated = result);
  }
}
