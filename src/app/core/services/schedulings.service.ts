import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Page} from "../models/page.model";
import {Pageable} from "../models/pageable.model";
import {Scheduling} from "../models/scheduling.model";
import {CreationScheduling} from "../models/creation-scheduling.model";

@Injectable()
export class SchedulingsService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getAllFromEnvironment(idEnvironment: number, pageable: any = new Pageable(0,20)): Observable<Page<Scheduling>> {
    return this.apiService.get(`/schedulings/env/${idEnvironment}`, pageable);
  }

  get(slug): Observable<Scheduling> {
    return this.apiService.get('/schedulings/' + slug);
  }

  add(scheduling: CreationScheduling): Observable<Scheduling> {
    return this.apiService.put(`/schedulings`, scheduling);
  }

  delete(scheduling: Scheduling): Observable<void> {
    return this.apiService.delete(`/schedulings/${scheduling.id}`);
  }

}
