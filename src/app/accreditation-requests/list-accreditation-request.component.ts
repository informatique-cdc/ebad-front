import {Component, Input, OnInit} from '@angular/core';
import {AccreditationRequestsService} from '../core/services';
import {Pageable} from "../core/models/pageable.model";
import {Action, ColumnsDefinition, Table} from "../shared/table/table.model";
import {Constants} from "../shared/Constants";
import {Observable} from "rxjs";
import {AccreditationRequest} from "../core/models";
import {Page} from "../core/models/page.model";
import {ActionClickEvent} from "../shared/table/action-click-event.model";

@Component({
  selector: 'app-list-accreditation-request',
  templateUrl: './list-accreditation-request.component.html'
})
export class ListAccreditationRequestComponent implements OnInit {
  @Input() userOnly: boolean;
  title = 'Liste des demandes d\'accréditation à traiter';

  private idActionAccept = 'accept';
  private idActionReject = 'reject';

  size = this.constants.numberByPage;
  page = 0;
  totalSize = 0;
  table: Table;


  constructor(private accreditationRequestsService: AccreditationRequestsService,
              private constants: Constants) {
  }

  ngOnInit(): void {
    if(this.userOnly){
      this.title = 'Liste des demandes d\'accréditation';
    }
    this.showAccreditationRequest();
  }

  listRequest(pageable: Pageable) : Observable<Page<AccreditationRequest>> {
    if(this.userOnly) {
      return this.accreditationRequestsService.getAllMyRequests(pageable);
    }
    return this.accreditationRequestsService.getAllNeedAnswer(pageable);
  }

  refreshAccreditationRequests(pageable: Pageable = new Pageable(0, this.constants.numberByPage, 'id,desc')) {
    this.listRequest(pageable).subscribe(
      accreditationRequests => {
        this.table.items = accreditationRequests.content;
        for (let request of this.table.items) {
          request.application = request.application.name;
        }
        this.totalSize = accreditationRequests.totalElements;
      }
    );
  }

  showAccreditationRequest() {
    this.table = new Table();
    this.table.showHeader = true;
    this.table.showFooter = true;

    this.table.settings.columnsDefinition.id = new ColumnsDefinition();
    this.table.settings.columnsDefinition.id.title = 'Id';
    this.table.settings.columnsDefinition.id.order = 1;
    this.table.settings.columnsDefinition.application = new ColumnsDefinition();
    this.table.settings.columnsDefinition.application.title = 'Nom de l\'application';
    this.table.settings.columnsDefinition.application.order = 2;
    this.table.settings.columnsDefinition.wantUse = new ColumnsDefinition();
    this.table.settings.columnsDefinition.wantUse.title = 'Droit d\'utilisation';
    this.table.settings.columnsDefinition.wantUse.order = 3;
    this.table.settings.columnsDefinition.wantManage = new ColumnsDefinition();
    this.table.settings.columnsDefinition.wantManage.title = 'Droit de gestion';
    this.table.settings.columnsDefinition.wantManage.order = 4;
    this.table.settings.columnsDefinition.state = new ColumnsDefinition();
    this.table.settings.columnsDefinition.state.title = 'Etat';
    this.table.settings.columnsDefinition.state.order = 5;
    if(!this.userOnly){
      this.table.settings.actionsDefinition.title = 'Action';
      this.table.settings.actionsDefinition.actions.push(new Action('Accepter', this.idActionAccept));
      this.table.settings.actionsDefinition.actions.push(new Action('Refuser', this.idActionReject));
    }
    this.refreshAccreditationRequests();
  }

  onActionClicked(event: ActionClickEvent) {
    if (event.id === this.idActionAccept) {
      this.accreditationRequestsService.sendResponse({accepted: true, id: event.item.id}).subscribe(
        () => {
          // this.notifierService.notify('success', `Demande acceptée avec succès`);
          this.refreshAccreditationRequests();
        },
        (error) => {
          // this.notifierService.notify('error', `Une erreur est survenue lors de l'acceptation : ${error}`);
          this.refreshAccreditationRequests();
        }
      )
    }

    if (event.id === this.idActionReject) {
      this.accreditationRequestsService.sendResponse({accepted: false, id: event.item.id}).subscribe(
        () => {
          // this.notifierService.notify('success', `Demande rejetée avec succès`);
          this.refreshAccreditationRequests();
        },
        (error) => {
          // this.notifierService.notify('error', `Une erreur est survenue lors du rejet : ${error}`);
          this.refreshAccreditationRequests();
        }
      );
    }
  }

  onPageChange(event) {
    this.refreshAccreditationRequests(new Pageable(this.page - 1, this.size, 'id,desc'))
  }
}

