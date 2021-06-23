import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Identity} from '../../core/models/identity.model';

@Component({
  selector: 'app-modal-identity-deletion',
  templateUrl: './modal-identity-deletion.component.html'
})
export class ModalIdentityDeletionComponent {
  identity: Identity;

  constructor(public activeModal: NgbActiveModal) {
  }
}
