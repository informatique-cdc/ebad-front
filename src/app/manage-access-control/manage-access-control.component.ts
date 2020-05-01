import {Component, OnInit} from '@angular/core';
import {Table} from '../shared/table/table.model';
import {ApplicationsService} from '../core/services';
import {Application, UsageApplication, User} from '../core/models';
import {Page} from "../core/models/page.model";
import {Constants} from "../shared/Constants";
import {Pageable} from "../core/models/pageable.model";


@Component({
  selector: 'app-admin-users',
  templateUrl: './manage-access-control.component.html'
})
export class ManageAccessControlComponent implements OnInit {
  applicationSelected: Application;

  table: Table;
  pageSize = this.constants.numberByPage;

  pagination = {
    itemsPerPage: this.pageSize,
    currentPage: 0,
    totalItems: 0
  };
  peoplesPage = {
    to: 0,
    from: 0,
    of: 0
  };

  users: UsageApplication[] = [];

  constructor(private applicationsService: ApplicationsService,
              private constants: Constants) {

  }

  ngOnInit() {

  }

  changePage(event){
    this.refreshUsers(new Pageable(event-1,this.pageSize));
  }

  applicationChanged(application: Application) {
    this.applicationSelected = application;
    this.changePage(1);
  }

  refreshUsers(pageable: Pageable) {
    this.applicationsService.getUsageFromApplication(this.applicationSelected.id, pageable).subscribe(
      (usageApp) => {
        this.pagination.currentPage = usageApp.number + 1;
        this.pagination.itemsPerPage = usageApp.size;
        this.pagination.totalItems = usageApp.totalElements;
        this.users = usageApp.content;
        this.peoplesPage.from = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + 1;
        this.peoplesPage.to = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + this.pagination.itemsPerPage;
        this.peoplesPage.of = this.pagination.totalItems;
        if(this.peoplesPage.to > this.peoplesPage.of){
          this.peoplesPage.to = this.peoplesPage.of;
        }
      }
    );
  }

}
