import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Statistics} from '../models';


@Injectable()
export class StatisticsService {
  constructor (
    private apiService: ApiService
  ) {}

  get(): Observable<Statistics> {
    return this.apiService.get(`/statistics`);
  }
}
