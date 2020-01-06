import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Application, User} from '../models';
import {Page} from "../models/page.model";
import {Pageable} from "../models/pageable.model";

@Injectable()
export class ApplicationsService {
  private apiName = '/applications';
  constructor(
    private apiService: ApiService
  ) {
  }

  importApplications(): Observable<string> {
    return this.apiService.post(`${this.apiName}/import-all`);
  }

  getAll(pageable: Pageable = new Pageable(0,20)): Observable<Page<Application>> {
    return this.apiService.get(`${this.apiName}`,  pageable);
  }

  search(pageable: Pageable = new Pageable(0,20), name: string): Observable<Page<Application>> {
    return this.apiService.get(`${this.apiName}/search?name=${name}`,  pageable);
  }

  getAllModerable(pageable: Pageable = new Pageable(0,20)): Observable<Page<Application>> {
    return this.apiService.get(`${this.apiName}/write`, pageable);
  }

  getAllManage(pageable: any = new Pageable(0,20)): Observable<Page<Application>> {
    return this.apiService.get(`${this.apiName}/gestion`, pageable);
  }

  addApplication(application: Application): Observable<Application> {
    return this.apiService.put(`${this.apiName}/gestion`, application);
  }

  updateApplication(application: Application): Observable<Application> {
    return this.apiService.patch(`${this.apiName}/gestion`, application);
  }

  deleteApplication(applicationId: number): Observable<Application> {
    return this.apiService.delete(`${this.apiName}/gestion?appId=${applicationId}`);
  }

  getUsersFromApplication(applicationId: number): Observable<User[]> {
    return this.apiService.get(`${this.apiName}/users/${applicationId}`);
  }

  getModeratorsFromApplication(applicationId: number): Observable<User[]> {
    return this.apiService.get(`${this.apiName}/moderators/${applicationId}`);
  }

}
