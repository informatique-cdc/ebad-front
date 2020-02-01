import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Environment, InfoEnvironment} from '../models';
import {Pageable} from "../models/pageable.model";
import {Page} from "../models/page.model";

@Injectable()
export class EnvironmentsService {
  private apiName = '/environments';
  constructor(
    private apiService: ApiService
  ) {
  }

  get(slug): Observable<Environment> {
    return this.apiService.get(`${this.apiName}/${slug}`);
  }

  getEnvironmentFromApp(appId: number, pageable: any = new Pageable(0,20)): Observable<Page<Environment>> {
      return this.apiService.get(`${this.apiName}?applicationId=${appId}`,pageable);
  }

  getInfo(slug): Observable<InfoEnvironment> {
    return this.apiService.get(`${this.apiName}/info/${slug}`);
  }

  deleteEnvironemnt(slug) {
    return this.apiService.delete(`${this.apiName}?idEnv=${slug}`);
  }

  addEnvironment(environment: Environment): Observable<Environment> {
    return this.apiService.put(`${this.apiName}`, environment);
  }

  updateEnvironment(environment: Environment): Observable<Environment> {
    return this.apiService.patch(`${this.apiName}`, environment);
  }

  // FIXME Le verbe GET n'est pas pertinent pour faire une mise à jour
  changeDateTraitement(slug, params) {
    return this.apiService.get(`${this.apiName}/dateTraitement/${slug}`, params);
  }

  importEnvironmentToApp(appId: number){
    return this.apiService.post(`${this.apiName}/import/application/${appId}`);
  }
}
