import { Component, OnInit } from '@angular/core';

import {Notification, NotificationsService, User, UserService} from '../../core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  notifications: Notification[];

  constructor(
    private userService: UserService,
    private router: Router,
    private notificationsService: NotificationsService
  ) {}

  currentUser: User;

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );

    setInterval(()=> { this.showNotification() }, 10 * 1000);

  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl('/login');
  }

  showNotification(){
    this.notificationsService.getAll().subscribe(
      notifications => {
        this.notifications = notifications;
      }
    )
  }
}
