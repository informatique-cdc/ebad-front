import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NewsService, New} from '../core';
import {ModalNewComponent} from './modal-new/modal-new.component';
import {ModalNewDeletionComponent} from './modal-new-deletion/modal-new-deletion.component';
import {Constants} from '../shared/Constants';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ToastService} from '../core/services/toast.service';
import {TranslateService} from '@ngx-translate/core';
import LanguageSettings = DataTables.LanguageSettings;

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html'
})
export class AdminNewsComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  news: New[] = [];
  columns = [];

  constructor(private modalService: NgbModal,
              private constants: Constants,
              private newsService: NewsService,
              private toastService: ToastService,
              private translateService: TranslateService) {
    this.columns.push({data: 'id', name: 'id', visible: true});
    this.columns.push({data: 'title', name: 'titre', visible: true});
    this.columns.push({data: 'draft', name: 'brouillon', visible: true});
    this.columns.push({data: 'createdDate', name: 'date', visible: true});
    this.columns.push({data: '', name: 'actions', visible: true, orderable: false});
  }

  ngOnInit() {
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
        this.newsService
          .getAll({
              page: dataTablesParameters.start / dataTablesParameters.length,
              size: dataTablesParameters.length,
              sort: dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
              title: dataTablesParameters.search.value
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
      columns: this.columns
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
      this.toastService.showSuccess(`L'actualité a bien été ajoutée`);
      this.refreshNews();
    }, (reason) => {
      if (reason.apierror.message !== undefined) {
        this.toastService.showError( `Une erreur est survenue lors de l'ajout de l'actualité : ${reason.apierror.message}`);
      }
    });
    modalRef.componentInstance.isUpdate = false;
  }

  editNew(oneNew: New) {
    const modalRef = this.modalService.open(ModalNewComponent, {size: 'lg'});
    modalRef.result.then((result) => {
      this.toastService.showSuccess(`L'actualité a bien été modifiée`);
      this.refreshNews();
    }, (reason) => {
      if (reason.apierror.message !== undefined) {
        this.toastService.showError( `Une erreur est survenue lors de la modification de l'actualité : ${reason.apierror.message}`);
      }
    });
    modalRef.componentInstance.oneNew = {...oneNew};
    modalRef.componentInstance.isUpdate = true;
  }

  deleteNew(oneNew: New) {
    const modalRef = this.modalService.open(ModalNewDeletionComponent);
    modalRef.result.then(() => {
      this.newsService.deleteNew(oneNew.id).subscribe(
        () => {
          this.toastService.showSuccess(`L'actualité a été supprimée`);
          this.refreshNews();
        },
        reason => {
          this.toastService.showError( `Une erreur est survenue lors de la suppression de l'actualité : ${reason}`);
        }
      );
    });
    modalRef.componentInstance.oneNew = oneNew;
  }
  onResizeTable(event){
    if(event.oldWidth == undefined || event.newWidth === event.oldWidth){
      return;
    }
    this.refreshNews();
  }
}
