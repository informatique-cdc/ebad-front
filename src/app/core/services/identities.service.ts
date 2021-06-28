import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Page} from '../models/page.model';
import {Pageable} from '../models/pageable.model';
import {Identity} from '../models/identity.model';

@Injectable()
export class IdentitiesService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getAll(pageable: any = new Pageable(0, 20)): Observable<Page<Identity>> {
    return this.apiService.get(`/identities`, pageable);
  }

  getAllByApplication(applicationId: number, pageable: any = new Pageable(0, 20)): Observable<Page<Identity>> {
    return this.apiService.get(`/identities?applicationId=${applicationId}`, pageable);
  }
  addIdentity(identity: Identity): Observable<Identity> {
    return this.apiService.put('/identities', identity);
  }

  getIdentity(identityId: number): Observable<Identity> {
    return this.apiService.get(`/identities/${identityId}`);
  }

  updateIdentity(identity: Identity): Observable<Identity> {
    return this.apiService.patch('/identities', identity);
  }

  deleteIdentity(identityId: number): Observable<void> {
    return this.apiService.delete(`/identities/${identityId}`);
  }
}
