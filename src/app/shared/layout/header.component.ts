import { Component, OnInit } from '@angular/core';

import {Notification, NotificationsService, User, UserService} from '../../core';
import {Router} from '@angular/router';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private notificationsService: NotificationsService,
    private translateService: TranslateService
  ) {}

  currentUser: User;

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );

    this.showNotification();
    setInterval(()=> { this.showNotification() }, 10 * 1000);

  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl('/');

    //this.router.navigate(['']);
  }

  showNotification(){
    this.notificationsService.getAll().subscribe(
      notifications => {
        this.notifications = notifications;
      }
    )
  }

  markAsRead(){
    this.notificationsService.markAsRead().subscribe();
    this.showNotification();
  }

  changeLang(lang: string){
    this.translateService.use(lang);
  }
}
