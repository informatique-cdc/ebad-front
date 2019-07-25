import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Environment, InfoEnvironment} from '../models';

@Injectable()
export class EnvironmentsService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getAll(): Observable<Environment[]> {
    return this.apiService.get(`/environnement/`);
  }

  get(slug): Observable<Environment> {
    return this.apiService.get('/environnement/' + slug);
  }

  getInfo(slug): Observable<InfoEnvironment> {
    return this.apiService.get('/environnement/info/' + slug);
  }

  deleteEnvironemnt(slug) {
    return this.apiService.delete('/environnement?idEnv=' + slug);
  }

  addEnvironment(environment: Environment): Observable<Environment> {
    return this.apiService.put(`/environnement`, environment);
  }

  updateEnvironment(environment: Environment): Observable<Environment> {
    return this.apiService.patch(`/environnement`, environment);
  }

  // FIXME Le verbe GET n'est pas pertinent pour faire une mise à jour
  changeDateTraitement(slug, params) {
    return this.apiService.get('/environnement/dateTraitement/' + slug, params);
  }
}
