import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Batch, Trace} from '../models';

@Injectable()
export class BatchsService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getAllFromEnvironment(slug): Observable<Batch[]> {
    return this.apiService.get(`/batchs/env/` + slug);
  }

  getAllFromApplication(idApplication): Observable<Batch[]> {
    return this.apiService.get(`/batchs?environnements.application.id=${idApplication}`);
  }

  get(slug): Observable<Batch> {
    return this.apiService.get('/batchs/' + slug);
  }

  run(slug, params): Observable<Trace> {
    return this.apiService.get('/batchs/run/' + slug, params);
  }

  addBatch(batch): Observable<Batch> {
    return this.apiService.put(`/batchs`, batch);
  }

  updateBatch(batch): Observable<Batch> {
    return this.apiService.patch(`/batchs`, batch);
  }

}
