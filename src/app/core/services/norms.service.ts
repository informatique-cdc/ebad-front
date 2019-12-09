import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Norme} from '../models';

@Injectable()
export class NormsService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getAll(): Observable<Norme[]> {
    return this.apiService.get(`/norms`);
  }

  addNorm(norm: Norme): Observable<Norme> {
    return this.apiService.put('/norms', norm);
  }

  updateNorm(norm: Norme): Observable<Norme> {
    return this.apiService.patch('/norms', norm);
  }

  deleteNorm(normId: number): Observable<void> {
    return this.apiService.delete(`/norms/${normId}`);
  }
}
