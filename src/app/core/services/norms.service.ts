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
    return this.apiService.get(`/normes`);
  }

  addNorm(norm: Norme): Observable<Norme> {
    return this.apiService.put('/normes', norm);
  }

  updateNorm(norm: Norme): Observable<Norme> {
    return this.apiService.patch('/normes', norm);
  }

  deleteNorm(normId: number): Observable<void> {
    return this.apiService.delete(`/normes/${normId}`);
  }
}
