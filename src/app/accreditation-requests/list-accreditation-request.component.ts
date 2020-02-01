import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AccreditationRequestsService} from '../core/services';
import {Constants} from "../shared/Constants";
import {Observable, Subject} from "rxjs";
import {AccreditationRequest} from "../core/models";
import {Page} from "../core/models/page.model";
import {ToastService} from "../core/services/toast.service";
import {DataTableDirective} from "angular-datatables";

@Component({
  selector: 'app-list-accreditation-request',
  templateUrl: './list-accreditation-request.component.html'
})
export class ListAccreditationRequestComponent implements OnInit {
  @Input() userOnly: boolean;
  title = 'Liste des demandes d\'accréditation à traiter';

  @ViewChild(DataTableDirective, {static: true})
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  accreditationsRequests: AccreditationRequest[];

  constructor(private accreditationRequestsService: AccreditationRequestsService,
              private toastService: ToastService,
              private constants: Constants) {
  }

  ngOnInit(): void {
    if (this.userOnly) {
      this.title = 'Liste des demandes d\'accréditation';
    }

    this.dtOptions = {
      order: [[1, 'asc']],
      pagingType: 'full_numbers',
      pageLength: this.constants.numberByPage,
      serverSide: true,
      processing: false,
      ajax: (dataTablesParameters: any, callback) => {
        this.listRequest({
            'page': dataTablesParameters.start / dataTablesParameters.length,
            'size': dataTablesParameters.length,
            'sort': dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir
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
      columns: [{
        data: 'id',
      }, {data: 'application'}, {data: 'wantUse'}, {data: 'wantManage'}, {data: 'state'}, {
        data: '',
        orderable: false
      }]
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
    )
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

