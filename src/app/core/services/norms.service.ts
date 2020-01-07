import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Norme} from '../models';
import {Page} from "../models/page.model";
import {Pageable} from "../models/pageable.model";

@Injectable()
export class NormsService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getAll(pageable: any = new Pageable(0,20)): Observable<Page<Norme>> {
    return this.apiService.get(`/norms`, pageable);
  }

  getAllName(pageable: Pageable = new Pageable(0,20)): Observable<Page<Norme>> {
    return this.apiService.get(`/norms/name`, pageable);
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
