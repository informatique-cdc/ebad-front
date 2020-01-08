import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {New} from '../models';
import {Page} from "../models/page.model";
import {Pageable} from "../models/pageable.model";

@Injectable()
export class NewsService {
  private apiName = '/news';
  constructor(
    private apiService: ApiService
  ) {
  }

  getAllPublic(pageable: Pageable = new Pageable(0,20)): Observable<Page<New>> {
    return this.apiService.get(`${this.apiName}/public`,pageable);
  }

  getAll(pageable: any = new Pageable(0,20)): Observable<Page<New>> {
    return this.apiService.get(`${this.apiName}`,pageable);
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
