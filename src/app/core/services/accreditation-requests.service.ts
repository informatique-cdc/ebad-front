import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {
  AccreditationRequest,
  CreationAccreditationRequest, ResponseAccreditationRequest
} from '../models';
import {Page} from "../models/page.model";
import {Pageable} from "../models/pageable.model";

@Injectable()
export class AccreditationRequestsService {
  private apiName = '/accreditation-requests';
  constructor(
    private apiService: ApiService
  ) {
  }

  getAllNeedAnswer(pageable: Pageable = new Pageable(0,20)): Observable<Page<AccreditationRequest>> {
    return this.apiService.get(`${this.apiName}/need-answer`,  pageable);
  }

  getAllMyRequests(pageable: Pageable = new Pageable(0,20)): Observable<Page<AccreditationRequest>> {
    return this.apiService.get(`${this.apiName}`, pageable);
  }

  sendAccreditation(creationAccreditationRequest: CreationAccreditationRequest): Observable<AccreditationRequest> {
    return this.apiService.put(`${this.apiName}`, creationAccreditationRequest);
  }

  sendResponse(responseAccreditationRequest: ResponseAccreditationRequest): Observable<void> {
    return this.apiService.post(`${this.apiName}/response`, responseAccreditationRequest);
  }


}
