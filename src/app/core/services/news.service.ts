import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {New} from '../models';

@Injectable()
export class NewsService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getAllPublic(): Observable<New[]> {
    return this.apiService.get(`/actualites/public`);
  }

  getAll(): Observable<New[]> {
    return this.apiService.get(`/actualites`);
  }

  addNew(oneNew: New): Observable<void> {
    return this.apiService.put(`/actualites`, oneNew);
  }

  updateNew(oneNew: New): Observable<void> {
    return this.apiService.patch(`/actualites`, oneNew);
  }

  deleteNew(newId: number): Observable<void> {
    return this.apiService.delete(`/actualites/${newId}`);
  }


}
