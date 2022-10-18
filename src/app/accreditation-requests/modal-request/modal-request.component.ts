import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Application, CreationAccreditationRequest} from '../../core';
import {AccreditationRequestsService, ApplicationsService} from '../../core';
import {ToastService} from '../../core/services/toast.service';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {Pageable} from '../../core/models/pageable.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-ebad-modal-request',
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
              private applicationsService: ApplicationsService,
              private translateService: TranslateService) {
  }

  formatter = (result: Application) => result.name;


  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.applicationsService.search(new Pageable(0, 100, 'name,asc'), term)
          .pipe(
            map(value => value.content),
            tap(() => this.searchFailed = false),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            }))
      ),
      tap(() => this.searching = false)
    )

  ngOnInit(): void {
  }

  sendRequest(){
    this.request.applicationId = this.model.id;
    if (!this.request.wantUse && ! this.request.wantManage){
      this.translateService.get('ACCREDITATION.MESSAGE.NO_RIGHT_SELECTED').subscribe((msg) => this.toastService.showError(msg));
      return;
    }
    this.accreditationRequestsService.sendAccreditation(this.request).subscribe(
      () => {
        this.translateService.get('ACCREDITATION.MESSAGE.CREATION_OK').subscribe((msg) => this.toastService.showSuccess(msg));
        this.activeModal.close();
      },
      (error) => {
        this.translateService.get('ACCREDITATION.MESSAGE.CREATION_KO', {error}).subscribe((msg) => this.toastService.showError(msg));
      }
    );
  }
}
