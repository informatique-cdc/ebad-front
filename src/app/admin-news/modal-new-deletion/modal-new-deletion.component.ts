import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {New} from '../../core';

@Component({
  selector: 'app-modal-new-deletion',
  templateUrl: './modal-new-deletion.component.html'
})
export class ModalNewDeletionComponent {
  oneNew: New;

  constructor(public activeModal: NgbActiveModal) {
  }
}
