import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Batch, Trace} from '../models';
import {Page} from "../models/page.model";
import {Pageable} from "../models/pageable.model";

@Injectable()
export class BatchsService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getAllFromEnvironment(idEnvironment: number, pageable: Pageable = new Pageable(0,20)): Observable<Page<Batch>> {
    return this.apiService.get(`/batchs?environnements.id=${idEnvironment}`, pageable);
  }

  getAllFromApplication(idApplication: number, pageable: Pageable = new Pageable(0,20)): Observable<Page<Batch>> {
    return this.apiService.get(`/batchs?environnements.application.id=${idApplication}`, pageable);
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
