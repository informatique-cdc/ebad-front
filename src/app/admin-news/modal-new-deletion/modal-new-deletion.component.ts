import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {New} from '../../core/models';

@Component({
  selector: 'app-modal-new-deletion',
  templateUrl: './modal-new-deletion.component.html'
})
export class ModalNewDeletionComponent implements OnInit {
  oneNew: New;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }
}
