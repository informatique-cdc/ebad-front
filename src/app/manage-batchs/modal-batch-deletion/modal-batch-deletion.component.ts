import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Batch} from '../../core';

@Component({
  selector: 'app-modal-batch-deletion',
  templateUrl: './modal-batch-deletion.component.html'
})
export class ModalBatchDeletionComponent {
  batch: Batch;

  constructor(public activeModal: NgbActiveModal) {
  }
}
