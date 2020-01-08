import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NotifierService} from 'angular-notifier';
import {NewsService} from '../core/services';
import {ModalNewComponent} from './modal-new/modal-new.component';
import {ModalNewDeletionComponent} from './modal-new-deletion/modal-new-deletion.component';
import {Constants} from "../shared/Constants";
import {New} from "../core/models";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.scss']
})
export class AdminNewsComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  news: New[] = [];

  constructor(private modalService: NgbModal,
              private notifierService: NotifierService,
              private constants: Constants,
              private newsService: NewsService) {
  }

  ngOnInit() {
    this.dtOptions = {
      order: [[1, 'asc']],
      pagingType: 'full_numbers',
      pageLength: this.constants.numberByPage,
      serverSide: true,
      processing: false,
      ajax: (dataTablesParameters: any, callback) => {
        this.newsService
          .getAll({
              'page': dataTablesParameters.start / dataTablesParameters.length,
              'size': dataTablesParameters.length,
              'sort': dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
              'title': dataTablesParameters.search.value
            }
          )
          .subscribe(resp => {
            this.news = resp.content;
            callback({
              recordsTotal: resp.totalElements,
              recordsFiltered: resp.totalElements,
              data: []
            });
          });
      },
      columns: [{
        data: 'id',
        orderable: false
      }, {data: 'title'}, {data: 'draft'}, {data: 'createdDate'}, {
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

  refreshNews() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  onClickAddNew() {
    const modalRef = this.modalService.open(ModalNewComponent, {size: 'lg'});
    modalRef.result.then(() => {
      this.notifierService.notify('success', `L'actualité a bien été ajoutée`);
      this.refreshNews();
    }, (reason) => {
      if (reason.message !== undefined) {
        this.notifierService.notify('error', `Une erreur est survenue lors de l'ajout de l'actualité : ${reason.message}`);
      }
    });
    modalRef.componentInstance.isUpdate = false;
  }

  editNew(oneNew: New) {
    const modalRef = this.modalService.open(ModalNewComponent, {size: 'lg'});
    modalRef.result.then((result) => {
      this.notifierService.notify('success', `L'actualité a bien été modifiée`);
      this.refreshNews();
    }, (reason) => {
      if (reason.message !== undefined) {
        this.notifierService.notify('error', `Une erreur est survenue lors de la modification de l'actualité : ${reason.message}`);
      }
    });
    modalRef.componentInstance.oneNew = oneNew;
    modalRef.componentInstance.isUpdate = true;
  }

  deleteNew(oneNew: New) {
    const modalRef = this.modalService.open(ModalNewDeletionComponent);
    modalRef.result.then((result) => {
      this.newsService.deleteNew(oneNew.id).subscribe(
        () => {
          this.notifierService.notify('success', `L'actualité a été supprimée`);
          this.refreshNews();
        },
        reason => {
          this.notifierService.notify('error', `Une erreur est survenue lors de la suppression de l'actualité : ${reason}`);
        }
      );
    }, reason => {
    });
    modalRef.componentInstance.oneNew = oneNew;
  }

}
