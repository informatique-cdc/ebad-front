import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Norme} from '../../core';

@Component({
  selector: 'app-modal-norm-deletion',
  templateUrl: './modal-norm-deletion.component.html'
})
export class ModalNormDeletionComponent {
  norm: Norme;

  constructor(public activeModal: NgbActiveModal) {
  }
}
