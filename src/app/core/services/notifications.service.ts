import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Notification} from "../models";

@Injectable()
export class NotificationsService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getAll(): Observable<Notification[]> {
    return this.apiService.get(`/notifications`);
  }

  markAsRead(): Observable<Notification> {
    return this.apiService.patch('/notifications');
  }

}
