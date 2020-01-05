import {Component, OnInit} from '@angular/core';
import {AccreditationRequestsService, ApplicationsService} from '../core/services';
import {Observable, of} from "rxjs";
import {catchError, debounceTime, distinctUntilChanged, map, switchMap, tap} from "rxjs/operators";
import {Application, CreationAccreditationRequest} from "../core/models";
import {Pageable} from "../core/models/pageable.model";
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'ebad-synthesis-accreditation-request',
  templateUrl: './synthesis-accreditation-request.component.html'
})
export class SynthesisAccreditationRequest {

  constructor() {
  }

}

