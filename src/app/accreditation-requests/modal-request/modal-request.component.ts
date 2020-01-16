import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FileKind} from '../../core/models/file-kind.model';
import {FileKindsService} from '../../core/services/file-kinds.service';
import {Application, CreationAccreditationRequest} from '../../core/models';
import {DatePipe} from '@angular/common';
import {AccreditationRequestsService, ApplicationsService} from "../../core/services";
import {ToastService} from "../../core/services/toast.service";
import {Observable, of} from "rxjs";
import {catchError, debounceTime, distinctUntilChanged, map, switchMap, tap} from "rxjs/operators";
import {Pageable} from "../../core/models/pageable.model";

@Component({
  selector: 'ebad-modal-request',
  templateUrl: './modal-request.component.html'
})
export class ModalRequestComponent implements OnInit {
  model: Application;
  searching = false;
  searchFailed = false;
  request: CreationAccreditationRequest = {applicationId: undefined, wantManage: false, wantUse: false};

  constructor(private accreditationRequestsService: AccreditationRequestsService,
              private toastService: ToastService,
              public activeModal: NgbActiveModal,
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
        this.toastService.showSuccess(`Votre demande d'accréditation a bien été envoyée`);
        this.activeModal.close();
      },
      (error) => {
        this.toastService.showError( `Votre demande d'accréditation n'a pas pu être envoyée : ${error}`)
      }
    );
  }
}
