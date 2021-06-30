import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {ApiToken} from '../models';
import {Page} from '../models/page.model';
import {Pageable} from '../models/pageable.model';

@Injectable()
export class ApiTokensService {
  private apiName = '/api-tokens';
  constructor(
    private apiService: ApiService
  ) {
  }

  getAll(pageable: Pageable = new Pageable(0, 20)): Observable<Page<ApiToken>> {
    return this.apiService.get(`${this.apiName}`,  pageable);
  }

  addApiToken(apiToken: ApiToken): Observable<ApiToken> {
    return this.apiService.put(`${this.apiName}`, apiToken);
  }


  deleteApiToken(apiTokenId: number): Observable<any> {
    return this.apiService.delete(`${this.apiName}/${apiTokenId}`);
  }
}
