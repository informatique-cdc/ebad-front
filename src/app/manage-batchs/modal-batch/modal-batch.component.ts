import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BatchsService, EnvironmentsService, Application, Batch} from '../../core';
import {Pageable} from '../../core/models/pageable.model';
import {ToastService} from '../../core/services/toast.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-modal-batch',
    templateUrl: './modal-batch.component.html'
})
export class ModalBatchComponent implements OnInit {
    dropdownList = [];
    dropdownSettings = {};
    application: Application;
    isUpdate = false;
    title = 'Ajouter un batch';
    action = 'Ajouter';
    batch: Batch = {
        id: undefined,
        name: undefined,
        defaultParam: undefined,
        environnements: [],
        createdBy: undefined,
        createdDate: undefined,
        lastModifiedBy: undefined,
        lastModifiedDate: undefined,
        path: ''
    };

    constructor(public activeModal: NgbActiveModal,
                private batchsService: BatchsService,
                private toastService: ToastService,
                private translateService: TranslateService,
                private environnementService: EnvironmentsService) {
    }

    ngOnInit() {
        this.environnementService.getEnvironmentFromApp(this.application.id, new Pageable(0, 200, 'name,asc'))
            .subscribe((page) => this.dropdownList = page.content);
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Tout sélectionner',
            unSelectAllText: 'Tout désélectionner',
            itemsShowLimit: 3,
            allowSearchFilter: true
        };

        if (this.isUpdate) {
            this.title = `Modifier le batch ${this.batch.name}`;
            this.action = `Modifier`;
        }
    }

    addBatch() {
        if (!this.isUpdate) {
            this.batchsService.addBatch(this.batch).subscribe(
                batch => {
                    this.activeModal.close(batch);
                }
            );
        } else {
            this.batchsService.updateBatch(this.batch).subscribe(
                batch => {
                    this.activeModal.close(batch);
                }
            );
        }
    }
}
