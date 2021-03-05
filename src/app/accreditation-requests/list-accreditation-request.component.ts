import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AccreditationRequestsService, AccreditationRequest} from '../core';
import {Constants} from '../shared/Constants';
import {Observable, Subject} from 'rxjs';
import {Page} from '../core/models/page.model';
import {ToastService} from '../core/services/toast.service';
import {DataTableDirective} from 'angular-datatables';
import {TranslateService} from '@ngx-translate/core';
import LanguageSettings = DataTables.LanguageSettings;

@Component({
  selector: 'app-list-accreditation-request',
  templateUrl: './list-accreditation-request.component.html'
})
export class ListAccreditationRequestComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() userOnly: boolean;
  title = 'Liste des demandes d\'accréditation à traiter';

  @ViewChild(DataTableDirective, {static: true})
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  accreditationsRequests: AccreditationRequest[];

  constructor(private accreditationRequestsService: AccreditationRequestsService,
              private toastService: ToastService,
              private constants: Constants,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    const columnsForAdminOrModo = [{data: 'id', }, {data: 'user'}, {data: 'application'}, {data: 'wantUse'}, {data: 'wantManage'}, {data: 'state'}, {data: '', orderable: false}];
    const columnsForUserOnly = [{data: 'id', }, {data: 'application'}, {data: 'wantUse'}, {data: 'wantManage'}, {data: 'state'}];
    let columns = columnsForAdminOrModo;
    if (this.userOnly) {
      this.title = 'Liste des demandes d\'accréditation';
      columns = columnsForUserOnly;
    }

    this.dtOptions = {
      language: this.constants.datatable[this.translateService.currentLang] as LanguageSettings,
      stateSave: true,
            stateSaveParams: function (settings, data: any) {
              data.search.search = "";
            },
      order: [[1, 'asc']],
      pagingType: 'full_numbers',
      pageLength: this.constants.numberByPage,
      serverSide: true,
      processing: false,
      ajax: (dataTablesParameters: any, callback) => {
        this.listRequest({
            page: dataTablesParameters.start / dataTablesParameters.length,
            size: dataTablesParameters.length,
            sort: dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir
          }
        )
          .subscribe(resp => {
            this.accreditationsRequests = resp.content;
            callback({
              recordsTotal: resp.totalElements,
              recordsFiltered: resp.totalElements,
              data: []
            });
          });
      },
      columns
    };
    this.dtTrigger.next();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  refreshAccreditationRequests() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  listRequest(pageable: any): Observable<Page<AccreditationRequest>> {
    if (this.userOnly) {
      return this.accreditationRequestsService.getAllMyRequests(pageable);
    }
    return this.accreditationRequestsService.getAllNeedAnswer(pageable);
  }

  accept(accreditationRequest: AccreditationRequest) {
    this.accreditationRequestsService.sendResponse({accepted: true, id: accreditationRequest.id}).subscribe(
      () => {
        this.toastService.showSuccess(`Demande acceptée avec succès`);
        this.refreshAccreditationRequests();
      },
      (error) => {
        this.toastService.showError(`Une erreur est survenue lors de l'acceptation : ${error}`);
        this.refreshAccreditationRequests();
      }
    );
  }

  reject(accreditationRequest: AccreditationRequest) {
    this.accreditationRequestsService.sendResponse({accepted: false, id: accreditationRequest.id}).subscribe(
      () => {
        this.toastService.showSuccess(`Demande rejetée avec succès`);
        this.refreshAccreditationRequests();
      },
      (error) => {
        this.toastService.showError(`Une erreur est survenue lors du rejet : ${error}`);
        this.refreshAccreditationRequests();
      }
    );
  }
}

