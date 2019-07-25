import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {User} from '../models';
import {UserApplication} from '../models/user-application.model';

@Injectable()
export class UsersService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getAll(): Observable<User[]> {
    return this.apiService.get(`/users`);
  }

  addUser(user: User): Observable<User> {
    return this.apiService.put(`/users`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.apiService.patch(`/users`, user);
  }

  activateUser(key): Observable<void> {
    return this.apiService.get(`/users/activate?key=${key}`);
  }

  inactivateUser(login): Observable<User> {
    return this.apiService.get(`/users/inactivate/${login}`);
  }

  updateAccessApplication(userApplication: UserApplication): Observable<User> {
    return this.apiService.patch(`/users/application`, userApplication);
  }
}
