import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Batch} from '../../core/models';

@Component({
  selector: 'app-modal-batch-deletion',
  templateUrl: './modal-batch-deletion.component.html'
})
export class ModalBatchDeletionComponent implements OnInit {
  batch: Batch;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }
}
