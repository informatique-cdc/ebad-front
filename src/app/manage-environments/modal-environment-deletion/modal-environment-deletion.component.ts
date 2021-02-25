import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Environment} from '../../core';

@Component({
  selector: 'app-modal-environment-deletion',
  templateUrl: './modal-environment-deletion.component.html'
})
export class ModalEnvironmentDeletionComponent {
  environment: Environment;

  constructor(public activeModal: NgbActiveModal) {
  }

}
