import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Norme} from '../../core';

@Component({
  selector: 'app-modal-identity-deletion',
  templateUrl: './modal-norm-deletion.component.html'
})
export class ModalIdentityDeletionComponent {
  norm: Norme;

  constructor(public activeModal: NgbActiveModal) {
  }
}
