import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Chain, Trace} from '../models';
import {Pageable} from "../models/pageable.model";
import {Page} from "../models/page.model";

@Injectable()
export class ChainsService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getAllFromEnvironment(environmentId, pageable: any = new Pageable(0,20)): Observable<Page<Chain>> {
    return this.apiService.get(`/chaines/env/${environmentId}`, pageable);
  }

  get(chainId): Observable<Chain> {
    return this.apiService.get('/chaines/' + chainId);
  }

  run(chainId, params): Observable<Trace> {
    return this.apiService.get('/chaines/run/' + chainId, params);
  }

  createChain(chain: Chain): Observable<Chain> {
    return this.apiService.put('/chaines', chain);
  }

  updateChain(chain: Chain): Observable<Chain> {
    return this.apiService.patch('/chaines', chain);
  }

  deleteChaine(chain: Chain): Observable<Chain> {
    return this.apiService.delete(`/chaines/delete/${chain.id}`);
  }
}
