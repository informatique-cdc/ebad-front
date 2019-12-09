import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {New} from '../models';

@Injectable()
export class NewsService {
  private apiName = '/news';
  constructor(
    private apiService: ApiService
  ) {
  }

  getAllPublic(): Observable<New[]> {
    return this.apiService.get(`${this.apiName}/public`);
  }

  getAll(): Observable<New[]> {
    return this.apiService.get(`${this.apiName}`);
  }

  addNew(oneNew: New): Observable<void> {
    return this.apiService.put(`${this.apiName}`, oneNew);
  }

  updateNew(oneNew: New): Observable<void> {
    return this.apiService.patch(`${this.apiName}`, oneNew);
  }

  deleteNew(newId: number): Observable<void> {
    return this.apiService.delete(`${this.apiName}/${newId}`);
  }


}
