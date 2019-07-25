import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Chain, Trace} from '../models';

@Injectable()
export class ChainsService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getAllFromEnvironment(environmentId): Observable<Chain[]> {
    return this.apiService.get(`/chaines/env/` + environmentId);
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
