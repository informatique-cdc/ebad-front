import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Application, User} from '../models';

@Injectable()
export class ApplicationsService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getAll(): Observable<Application[]> {
    return this.apiService.get(`/application/`);
  }

  getAllModerable(): Observable<Application[]> {
    return this.apiService.get(`/application/write`);
  }

  getAllManage(): Observable<Application[]> {
    return this.apiService.get(`/application/gestion`);
  }

  addApplication(application: Application): Observable<Application> {
    return this.apiService.put(`/application/gestion`, application);
  }

  updateApplication(application: Application): Observable<Application> {
    return this.apiService.patch(`/application/gestion`, application);
  }

  deleteApplication(applicationId: number): Observable<Application> {
    return this.apiService.delete(`/application/gestion?appId=${applicationId}`);
  }

  getUsersFromApplication(applicationId: number): Observable<User[]> {
    return this.apiService.get(`/application/users/${applicationId}`);
  }

  getModeratorsFromApplication(applicationId: number): Observable<User[]> {
    return this.apiService.get(`/application/moderators/${applicationId}`);
  }

}
