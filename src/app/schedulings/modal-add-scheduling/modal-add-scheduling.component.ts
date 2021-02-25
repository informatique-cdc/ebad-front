import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Batch, BatchsService, Environment} from '../../core';
import {Pageable} from '../../core/models/pageable.model';
import {SchedulingsService} from '../../core/services/schedulings.service';
import {CreationScheduling} from '../../core/models/creation-scheduling.model';

@Component({
  selector: 'app-modal-run-with-parameters',
  templateUrl: './modal-add-scheduling.component.html'
})
export class ModalAddSchedulingComponent  implements OnInit {
  batchs: Batch[];

  parameters: string;
  batch: Batch;
  environment: Environment;

  scheduling: CreationScheduling = new class implements CreationScheduling {
    batchId: number;
    cron: string;
    environmentId: number;
    parameters: string;
  }();

  constructor(public activeModal: NgbActiveModal, private batchsService: BatchsService, private schedulignsService: SchedulingsService) { }

  ngOnInit(): void {
    this.batchsService.getAllFromEnvironment(this.environment.id, new Pageable(0, 1000)).subscribe(
      batchs => {
        this.batchs = batchs.content;
      }
    );
  }

  onSave(){
    this.scheduling.environmentId = this.environment.id;
    this.scheduling.batchId = this.batch.id;
    this.schedulignsService.add(this.scheduling).subscribe(
      scheduling => {
        this.activeModal.close(scheduling);
      },
      error => {
        this.activeModal.dismiss(error);
      }
    );
  }
}
