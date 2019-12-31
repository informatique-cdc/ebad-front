import {Component, OnInit} from '@angular/core';
import {AccreditationRequestsService} from '../core/services';
import {Pageable} from "../core/models/pageable.model";
import {ColumnsDefinition, Table} from "../shared/table/table.model";
import {Constants} from "../shared/Constants";

@Component({
  selector: 'app-user-list-accreditation-request',
  templateUrl: './user-list-accreditation-request.component.html'
})
export class UserListAccreditationRequestComponent implements OnInit {
  size = this.constants.numberByPage;
  page = 0;
  totalSize = 0;
  table: Table;


  constructor(private accreditationRequestsService: AccreditationRequestsService,
              private constants: Constants) {
  }

  ngOnInit(): void {
    this.showAccreditationRequest();
  }

  refreshAccreditationRequests(pageable: Pageable = new Pageable(0, this.constants.numberByPage, 'id,desc')) {
    this.accreditationRequestsService.getAllMyRequests(pageable).subscribe(
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
    this.refreshAccreditationRequests();
  }

  onPageChange(event) {
    this.refreshAccreditationRequests(new Pageable(this.page - 1, this.size, 'id,desc'))
  }
}

