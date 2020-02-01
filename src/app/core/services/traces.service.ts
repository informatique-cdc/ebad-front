import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Trace} from '../models';
import {Page} from '../models/page.model';

@Injectable()
export class TracesService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getAllFromEnvironment(slug, params): Observable<Page<Trace>> {
    return this.apiService.get(`/logs/` + slug, params);
  }


}
