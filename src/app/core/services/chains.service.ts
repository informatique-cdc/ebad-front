import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Chain, Trace} from '../models';
import {Pageable} from "../models/pageable.model";
import {Page} from "../models/page.model";

@Injectable()
export class ChainsService {
  private apiName = 'chains';
  constructor(
    private apiService: ApiService
  ) {
  }

  getAllFromEnvironment(environmentId, pageable: any = new Pageable(0,20)): Observable<Page<Chain>> {
    return this.apiService.get(`/${this.apiName}/env/${environmentId}`, pageable);
  }

  get(chainId): Observable<Chain> {
    return this.apiService.get(`/${this.apiName}/` + chainId);
  }

  run(chainId): Observable<Trace> {
    return this.apiService.post(`/${this.apiName}/${chainId}/run`);
  }

  createChain(chain: Chain): Observable<Chain> {
    return this.apiService.put(`/${this.apiName}`, chain);
  }

  updateChain(chain: Chain): Observable<Chain> {
    return this.apiService.patch(`/${this.apiName}`, chain);
  }

  deleteChaine(chain: Chain): Observable<Chain> {
    return this.apiService.delete(`/${this.apiName}/${chain.id}`);
  }
}
