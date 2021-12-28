import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Environment, InfoEnvironment} from '../models';
import {Pageable} from '../models/pageable.model';
import {Page} from '../models/page.model';

@Injectable()
export class EnvironmentsService {
  private apiName = '/environments';

  constructor(
    private apiService: ApiService
  ) {
  }

  get(slug): Observable<Environment> {
    if (slug === undefined){
      return new Observable<Environment>();
    }
    return this.apiService.get(`${this.apiName}/${slug}`);
  }

  getEnvironmentFromApp(appId: number, pageable: any = new Pageable(0, 20, 'name,asc')): Observable<Page<Environment>> {
    if (appId === undefined){
      return new Observable<Page<Environment>>(subscriber => subscriber.next({
        first: false,
        last: false,
        number: 0,
        numberOfElements: 0,
        pageable: undefined,
        size: 0,
        sort: undefined,
        totalElements: 0,
        totalPages: 0,
        content: []}));
    }
    if (pageable.sort === undefined) {
      pageable.sort = 'name,asc';
    }
    return this.apiService.get(`${this.apiName}?applicationId=${appId}`, pageable);
  }

  getInfo(slug): Observable<InfoEnvironment> {
    if (slug === undefined){
       return new Observable<InfoEnvironment>();
    }
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

  importEnvironmentToApp(appId: number) {
    return this.apiService.post(`${this.apiName}/import/application/${appId}`);
  }
}
