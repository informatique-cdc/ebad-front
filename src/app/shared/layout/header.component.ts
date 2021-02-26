import {Component, OnDestroy, OnInit} from '@angular/core';

import {Notification, NotificationsService, User, UserService} from '../../core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {RxStompService} from '@stomp/ng2-stompjs';
import {ToastService} from '../../core/services/toast.service';

@Component({
    selector: '[ebad-header]',
    templateUrl: './header.component.html',
    styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    notifications: Notification[] = [];
    notificationsWsReceived: Set<number> = new Set<number>();
    sub: Subscription;
    currentUser: User;

    constructor(
        private userService: UserService,
        private router: Router,
        private notificationsService: NotificationsService,
        private translateService: TranslateService,
        private rxStompService: RxStompService,
        private toastService: ToastService
    ) {
    }


    ngOnInit() {
        this.showNotification();
        this.userService.currentUser.subscribe((us) => this.currentUser = us);
        this.notificationsService.getAll().subscribe(
            (notifications) => {
                this.notifications = notifications;
            }
        );
    }


    logout() {
        this.userService.purgeAuth();
        this.router.navigateByUrl('/login');
    }

    showNotification() {
        this.sub = this.rxStompService.watch('/user/queue/notifications').subscribe({
            next: this.addNotification
        });
    }

    private addNotification = receivedMsg => {
        const result: Notification = JSON.parse(receivedMsg.body);
        if (this.notificationsWsReceived.has(result.id)){
            return;
        }
        this.notificationsWsReceived.add(result.id);
        this.toastService.showSuccess(result.content);
        this.notifications.push(result);
    }

    markAsRead() {
        this.notificationsService.markAsRead().subscribe();
        this.notifications = [];
    }

    changeLang(lang: string) {
        this.translateService.use(lang);
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
