import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Application} from '../../core';

@Component({
  selector: 'app-modal-application-deletion',
  templateUrl: './modal-application-deletion.component.html'
})
export class ModalApplicationDeletionComponent {
  application: Application;

  constructor(public activeModal: NgbActiveModal) {
  }
}
