import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Chain, Environment, ChainsService} from '../core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalChainComponent} from './modal-chain/modal-chain.component';
import {ModalChainDeletionComponent} from './modal-chain-deletion/modal-chain-deletion.component';
import {Constants} from '../shared/Constants';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ToastService} from '../core/services/toast.service';
import {TranslateService} from '@ngx-translate/core';
import LanguageSettings = DataTables.LanguageSettings;

@Component({
  selector: 'app-manage-chains',
  templateUrl: './manage-chains.component.html'
})
export class ManageChainsComponent implements AfterViewInit, OnDestroy, OnInit {
  environmentSelected: Environment;
  chains: Chain[];

  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  columns = [];

  constructor(private chainsService: ChainsService,
              private modalService: NgbModal,
              private toastService: ToastService,
              private constants: Constants,
              private translateService: TranslateService) {
    this.columns.push({data: 'id', name: 'id', visible: true});
    this.columns.push({data: 'name', name: 'nom', visible: true});
    this.columns.push({data: 'description', name: 'description', visible: true});
    this.columns.push({data: 'id', name: 'actions', visible: true, orderable: false});

  }

  ngOnInit() {
    this.dtOptions = {
      language: this.constants.datatable[this.translateService.currentLang] as LanguageSettings,
      stateSave: true,
            stateSaveParams(settings, data: any) {
              data.search.search = '';
            },
      order: [[0, 'asc']],
      pagingType: 'full_numbers',
      pageLength: this.constants.numberByPage,
      serverSide: true,
      processing: false,
      ajax: (dataTablesParameters: any, callback) => {
        if (!this.environmentSelected){
          this.chains = [];
          return;
        }
        this.chainsService
          .getAllFromEnvironment(this.environmentSelected.id, {
              page: dataTablesParameters.start / dataTablesParameters.length,
              size: dataTablesParameters.length,
              sort: dataTablesParameters.columns[dataTablesParameters.order[0].column].data + ',' + dataTablesParameters.order[0].dir,
              name: dataTablesParameters.search.value
            }
          )
          .subscribe(resp => {
            this.chains = resp.content;
            callback({
              recordsTotal: resp.totalElements,
              recordsFiltered: resp.totalElements,
              data: []
            });
          });
      },
      columns: this.columns
    };
    this.dtTrigger.next(undefined);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(undefined);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  refreshChains() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(undefined);
    });
  }
  environmentChanged(environment: Environment) {
    this.environmentSelected = environment;
    this.refreshChains();
  }


  onClickAddChain() {
    const modalRef = this.modalService.open(ModalChainComponent);
    modalRef.result.then((result) => {
      this.toastService.showSuccess(`La chaine ${result.name} a bien été ajoutée`);
      this.environmentChanged(this.environmentSelected);
    }, (reason) => {
      if (reason.apierror.message !== undefined) {
        this.toastService.showError( `Une erreur est survenue lors de l'ajout de la chaine : ${reason.apierror.message}`);
      }
    });
    modalRef.componentInstance.environment = this.environmentSelected;
    modalRef.componentInstance.isUpdate = false;
  }

  editChain(chain: Chain) {
    const modalRef = this.modalService.open(ModalChainComponent);
    modalRef.result.then((result) => {
      this.toastService.showSuccess(`La chaine ${result.name} a bien été modifiée`);
      this.environmentChanged(this.environmentSelected);
    }, (reason) => {
      if (reason.apierror.message !== undefined) {
        this.toastService.showError( `Une erreur est survenue lors de la modification de la chaine : ${reason.apierror.message}`);
      }
    });
    modalRef.componentInstance.environment = this.environmentSelected;
    modalRef.componentInstance.chain = {...chain};
    modalRef.componentInstance.isUpdate = true;
  }

  deleteChain(chain: Chain) {
    const modalRef = this.modalService.open(ModalChainDeletionComponent);
    modalRef.result.then(() => {
      this.chainsService.deleteChaine(chain).subscribe(
        () => {
          this.toastService.showSuccess(`Le chaine a été supprimée`);
          this.environmentChanged(this.environmentSelected);
        },
        reason => {
          this.toastService.showError( `Une erreur est survenue lors de la suppression de la chaine : ${reason}`);
        }
      );
    });
    modalRef.componentInstance.chain = chain;
  }

  onResizeTable(event){
    if (event.oldWidth === undefined || event.newWidth === event.oldWidth){
      return;
    }
    this.refreshChains();
  }
}

