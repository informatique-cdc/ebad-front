import {Component, OnInit} from '@angular/core';

import {Notification, NotificationsService, User, UserService} from '../../core';
import {Router} from '@angular/router';
import {TranslateService} from "@ngx-translate/core";
import {interval, Subscription} from "rxjs";

@Component({
  selector: '[ebad-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {
  notifications: Notification[] = [];
  notificationsGetAll: Subscription;
  timeSub: Subscription;
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
    const source = interval(10 * 1000);
    this.timeSub = source.subscribe(() => this.showNotification())
  }


  logout() {
    this.notificationsGetAll.unsubscribe();
    this.timeSub.unsubscribe();
    this.userService.purgeAuth();
    this.router.navigateByUrl('/login');

    //this.router.navigate(['']);
  }

  showNotification(){
    this.notificationsGetAll = this.notificationsService.getAll().subscribe(
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
