import {Component, OnInit} from '@angular/core';
import {AccreditationRequestsService, ApplicationsService} from '../core/services';
import {Observable, of} from "rxjs";
import {catchError, debounceTime, distinctUntilChanged, map, switchMap, tap} from "rxjs/operators";
import {Application, CreationAccreditationRequest} from "../core/models";
import {Pageable} from "../core/models/pageable.model";

@Component({
  selector: 'app-accreditation-request',
  templateUrl: './accreditation-request.component.html'
})
export class AccreditationRequestComponent implements OnInit {
  model: Application;
  searching = false;
  searchFailed = false;
  request: CreationAccreditationRequest = {applicationId: undefined, wantManage: false, wantUse: false};

  constructor(private accreditationRequestsService: AccreditationRequestsService,
              private applicationsService: ApplicationsService) {
  }

  formatter = (result: Application) => result.name;


  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.applicationsService.search(new Pageable(0,10, 'name,asc'), term)
          .pipe(
            map(value => value.content),
            tap(() => this.searchFailed = false),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            }))
      ),
      tap(() => this.searching = false)
    );

  ngOnInit(): void {
  }

  sendRequest(){
    this.request.applicationId = this.model.id;
    this.accreditationRequestsService.sendAccreditation(this.request).subscribe(
      () => {
        // this.notifierService.notify('success', `Votre demande d'accréditation a bien été envoyée`)
      },
      (error) => {
        // this.notifierService.notify('error', `Votre demande d'accréditation n'a pas pu être envoyée : ${error}`)
      }
    );
  }
}

