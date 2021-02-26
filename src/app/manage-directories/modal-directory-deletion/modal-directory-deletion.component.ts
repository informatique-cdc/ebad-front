import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Directory} from '../../core';

@Component({
  selector: 'app-modal-directory-deletion',
  templateUrl: './modal-directory-deletion.component.html'
})
export class ModalDirectoryDeletionComponent {
  directory: Directory;

  constructor(public activeModal: NgbActiveModal) {
  }
}
